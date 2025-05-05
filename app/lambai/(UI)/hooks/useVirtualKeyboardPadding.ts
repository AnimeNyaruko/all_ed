import { useState, useEffect, useRef } from "react";

// Use a more generic Event listener type initially
type EventListener = (event: Event) => void;

// Removed custom interface and global declaration to avoid conflicts
/*
interface MathLiveVirtualKeyboard extends EventTarget {
	addEventListener(type: string, listener: EventListener | null, options?: boolean | AddEventListenerOptions): void;
	removeEventListener(type: string, listener: EventListener | null, options?: boolean | EventListenerOptions): void;
	boundsChanged?: () => void;
	boudningRect: DOMRectReadOnly;
	visible: boolean;
}
declare global {
	interface Window {
		mathVirtualKeyboard?: MathLiveVirtualKeyboard;
	}
}
*/

/**
 * Custom hook to manage padding based on the MathLive virtual keyboard visibility and size.
 * Returns the calculated padding height in pixels.
 */
export function useVirtualKeyboardPadding(): number {
	const [keyboardPadding, setKeyboardPadding] = useState(0);
	const isKeyboardVisibleRef = useRef(false);

	useEffect(() => {
		// Check for window existence for SSR safety
		if (typeof window === "undefined") {
			return;
		}

		// Function to update padding based on keyboard state
		const updatePadding = () => {
			// Use 'any' type and perform runtime checks
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const vk = window.mathVirtualKeyboard as any;
			if (
				vk &&
				typeof vk.visible === "boolean" &&
				isKeyboardVisibleRef.current
			) {
				requestAnimationFrame(() => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const currentVk = window.mathVirtualKeyboard as any; // Re-check inside animation frame
					if (
						currentVk &&
						typeof currentVk.visible === "boolean" &&
						isKeyboardVisibleRef.current
					) {
						// Check if boundingRect exists and has a height property
						const rect = currentVk.boundingRect as DOMRectReadOnly | undefined;

						const newPadding =
							rect && typeof rect.height === "number" && rect.height > 0
								? rect.height
								: 0;

						setKeyboardPadding((prevPadding) => {
							if (prevPadding !== newPadding) {
								return newPadding;
							}
							return prevPadding;
						});
					} else if (!isKeyboardVisibleRef.current) {
						setKeyboardPadding((prevPadding) => {
							if (prevPadding !== 0) {
								return 0;
							}
							return prevPadding;
						});
					}
				});
			} else if (!isKeyboardVisibleRef.current) {
				setKeyboardPadding((prevPadding) => {
					if (prevPadding !== 0) {
						return 0;
					}
					return prevPadding;
				});
			}
		};

		// Handler for visibility change - use generic Event type
		const handleVisibilityToggle = (event: Event) => {
			const customEvent = event as CustomEvent<{ visible: boolean }>;
			if (
				customEvent.detail &&
				typeof customEvent.detail.visible === "boolean"
			) {
				const isVisible = customEvent.detail.visible;
				isKeyboardVisibleRef.current = isVisible;
				updatePadding();
			}
		};

		// Handler for geometry change - use generic Event type
		const handleGeometryChange = () => {
			if (isKeyboardVisibleRef.current) {
				updatePadding();
			}
		};

		let retryTimeout: NodeJS.Timeout | null = null;

		const setupListeners = () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const currentVk = window.mathVirtualKeyboard as any;
			// Check for existence and necessary methods/properties before adding listeners
			if (
				currentVk &&
				typeof currentVk.addEventListener === "function" &&
				typeof currentVk.removeEventListener === "function" &&
				typeof currentVk.visible === "boolean"
			) {
				isKeyboardVisibleRef.current = currentVk.visible;
				updatePadding(); // Initial padding check

				currentVk.addEventListener(
					"virtual-keyboard-toggle",
					handleVisibilityToggle as EventListener,
				);
				currentVk.addEventListener(
					"geometrychange",
					handleGeometryChange as EventListener,
				);
			} else {
				retryTimeout = setTimeout(setupListeners, 200);
			}
		};

		setupListeners();

		// Cleanup function
		return () => {
			if (retryTimeout) {
				clearTimeout(retryTimeout);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const currentVk = window.mathVirtualKeyboard as any;
			// Check for existence and method before removing listeners
			if (currentVk && typeof currentVk.removeEventListener === "function") {
				currentVk.removeEventListener(
					"virtual-keyboard-toggle",
					handleVisibilityToggle as EventListener,
				);
				currentVk.removeEventListener(
					"geometrychange",
					handleGeometryChange as EventListener,
				);
			}
		};
		// No dependencies needed as we are interacting with a global object
	}, []);

	return keyboardPadding;
}
