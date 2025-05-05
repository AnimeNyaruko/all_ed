"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UsePanelResizerProps {
	initialWidth: number;
	minWidth?: number;
	maxWidth?: number;
}

interface UsePanelResizerReturn {
	leftWidth: number;
	isDragging: boolean;
	ghostLeft: number | null;
	handleDragStart: (event: React.MouseEvent | React.TouchEvent) => void;
}

export const usePanelResizer = ({
	initialWidth,
	minWidth = 300, // Default min width
	maxWidth: initialMaxWidth, // Use initialMaxWidth to avoid conflict with calculated maxWidth
}: UsePanelResizerProps): UsePanelResizerReturn => {
	const [leftWidth, setLeftWidth] = useState(initialWidth);
	const [isDragging, setIsDragging] = useState(false);
	const [ghostLeft, setGhostLeft] = useState<number | null>(null);
	const dragStartXRef = useRef<number | null>(null);
	const startLeftWidthRef = useRef<number>(0);
	const ghostLeftRef = useRef<number | null>(null);

	// Dynamically calculate maxWidth based on window size if not provided
	const maxWidth =
		initialMaxWidth ??
		(typeof window !== "undefined" ? window.innerWidth - 300 : Infinity);

	// --- Custom Drag Handlers ---
	const handleDragMove = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (dragStartXRef.current === null) return;

			const currentX =
				"touches" in event ? event.touches[0].clientX : event.clientX;
			const deltaX = currentX - dragStartXRef.current;
			const newGhostLeft = startLeftWidthRef.current + deltaX;

			// Apply constraints
			const constrainedGhostLeft = Math.max(
				minWidth,
				Math.min(maxWidth, newGhostLeft),
			);

			setGhostLeft(constrainedGhostLeft);
			ghostLeftRef.current = constrainedGhostLeft;

			// Prevent default text selection during drag
			if (event.cancelable) {
				event.preventDefault();
			}
		},
		[minWidth, maxWidth], // Add minWidth and maxWidth as dependencies
	);

	const handleDragEnd = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (!isDragging) return;

			setIsDragging(false);

			if (ghostLeftRef.current !== null) {
				setLeftWidth(ghostLeftRef.current);
			}

			setGhostLeft(null);
			ghostLeftRef.current = null;
			dragStartXRef.current = null;

			// Re-enable user select is handled by useEffect cleanup
			if (event.cancelable) {
				event.preventDefault();
			}
		},
		[isDragging],
	);

	// Effect to add/remove global listeners based on isDragging state
	useEffect(() => {
		const moveHandler = (e: MouseEvent | TouchEvent) => handleDragMove(e);
		const endHandler = (e: MouseEvent | TouchEvent) => handleDragEnd(e);

		if (isDragging) {
			document.addEventListener("mousemove", moveHandler);
			document.addEventListener("mouseup", endHandler);
			document.addEventListener("touchmove", moveHandler, { passive: false });
			document.addEventListener("touchend", endHandler);
			document.body.style.userSelect = "none";
		} else {
			document.removeEventListener("mousemove", moveHandler);
			document.removeEventListener("mouseup", endHandler);
			document.removeEventListener("touchmove", moveHandler);
			document.removeEventListener("touchend", endHandler);
			document.body.style.userSelect = "";
		}

		return () => {
			document.removeEventListener("mousemove", moveHandler);
			document.removeEventListener("mouseup", endHandler);
			document.removeEventListener("touchmove", moveHandler);
			document.removeEventListener("touchend", endHandler);
			document.body.style.userSelect = "";
		};
	}, [isDragging, handleDragMove, handleDragEnd]);

	const handleDragStart = useCallback(
		(event: React.MouseEvent | React.TouchEvent) => {
			if (isDragging) return;

			const currentX =
				"touches" in event.nativeEvent
					? event.nativeEvent.touches[0].clientX
					: event.nativeEvent.clientX;
			dragStartXRef.current = currentX;
			startLeftWidthRef.current = leftWidth;
			ghostLeftRef.current = leftWidth;
			setGhostLeft(leftWidth);
			setIsDragging(true);

			event.preventDefault();
		},
		[leftWidth, isDragging], // Add leftWidth here
	);

	// Effect to set initial width only once on the client
	useEffect(() => {
		setLeftWidth(initialWidth);
	}, [initialWidth]);

	return { leftWidth, isDragging, ghostLeft, handleDragStart };
};
