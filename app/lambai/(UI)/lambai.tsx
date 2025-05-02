"use client";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import AnswerArea from "./AnswerArea";
import { submitAnswers } from "../(handler)/handler";
import { useOrientationCheck } from "./OrientationCheck";
import { RotationOverlay } from "./RotationOverlay";
import type {
	AnswerBlock,
	// FormattedOutput, // Removed as unused
	// QuestionStructure, // Removed as unused - Let's keep QuestionStructure for now as it might be needed later
} from "@/types";
import { redirect } from "next/navigation";
// Tách phần nội dung MathJax thành component riêng
const QuestionContent = memo(
	({ markdownContent }: { markdownContent: string }) => {
		const content = useMemo(
			() => (
				<div
					className="space-y-4 text-gray-900"
					style={{
						overflowWrap: "anywhere",
						wordBreak: "break-word",
						direction: "ltr",
					}}
				>
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-xl font-bold">Đề bài</h2>
					</div>

					<ReactMarkdown
						components={{
							div: ({ ...props }) => (
								<div
									className="prose max-w-none"
									style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
									{...props}
								/>
							),
							p: ({ ...props }) => (
								<p
									style={{
										overflowWrap: "anywhere",
										whiteSpace: "pre-wrap",
										wordBreak: "break-word",
									}}
									{...props}
								/>
							),
							pre: ({ ...props }) => (
								<pre
									style={{
										whiteSpace: "pre-wrap",
										overflowWrap: "anywhere",
										wordBreak: "break-word",
										maxWidth: "100%",
									}}
									{...props}
								/>
							),
							code: ({
								...props
							}: {
								inline?: boolean;
								children?: React.ReactNode;
							}) => {
								const isInline = props.inline;
								return isInline ? (
									<code
										style={{
											overflowWrap: "anywhere",
											whiteSpace: "pre-wrap",
											wordBreak: "break-word",
										}}
										{...props}
									/>
								) : (
									<code
										style={{
											display: "block",
											overflowWrap: "anywhere",
											whiteSpace: "pre-wrap",
											wordBreak: "break-word",
										}}
										{...props}
									/>
								);
							},
							sub: ({ ...props }) => <sub {...props} />,
						}}
						remarkPlugins={[remarkMath]}
						rehypePlugins={[rehypeKatex, rehypeRaw]}
					>
						{markdownContent}
					</ReactMarkdown>
				</div>
			),
			[markdownContent],
		);

		return content;
	},
);
QuestionContent.displayName = "QuestionContent";

export default function Home({ markdownContent }: { markdownContent: string }) {
	const [leftWidth, setLeftWidth] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [ghostLeft, setGhostLeft] = useState<number | null>(null);
	const dragStartXRef = useRef<number | null>(null);
	const startLeftWidthRef = useRef<number>(0);
	const ghostLeftRef = useRef<number | null>(null);
	const [answers, setAnswers] = useState<Record<string, AnswerBlock[]>>({});
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [isTimerPaused, setIsTimerPaused] = useState(false);
	const [timer, setTimer] = useState(0);
	const timerRef = useRef<NodeJS.Timeout>(null);
	const [isClient, setIsClient] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Kiểm tra hướng màn hình
	const isLandscape = useOrientationCheck();

	// Parse the JSON content
	const content = useMemo(() => {
		try {
			return JSON.parse(markdownContent);
		} catch (_e) {
			console.log(_e);
			return { de_bai: markdownContent };
		}
	}, [markdownContent]);

	// Extract questions (all keys except de_bai)
	const questions = useMemo(() => {
		const { de_bai: _de_bai, ...rest } = content;
		return rest;
	}, [content]);

	// Khởi tạo kích thước ban đầu & Set client state
	useEffect(() => {
		const initialWidth = window.innerWidth / 2;
		setLeftWidth(initialWidth);
		setIsClient(true);
	}, []);

	// --- Custom Drag Handlers ---
	const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
		if (dragStartXRef.current === null) return;

		const currentX =
			"touches" in event ? event.touches[0].clientX : event.clientX;
		const deltaX = currentX - dragStartXRef.current;
		const newGhostLeft = startLeftWidthRef.current + deltaX;

		// Apply constraints (e.g., min/max width)
		const minWidth = 300;
		const maxWidth = window.innerWidth - 300;
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
	}, []);

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
			// Optional: Disable text selection globally during drag
			document.body.style.userSelect = "none";
		} else {
			document.removeEventListener("mousemove", moveHandler);
			document.removeEventListener("mouseup", endHandler);
			document.removeEventListener("touchmove", moveHandler);
			document.removeEventListener("touchend", endHandler);
			// Re-enable user select when not dragging
			document.body.style.userSelect = "";
		}

		// Cleanup function to remove listeners when component unmounts or before re-running effect
		return () => {
			document.removeEventListener("mousemove", moveHandler);
			document.removeEventListener("mouseup", endHandler);
			document.removeEventListener("touchmove", moveHandler);
			document.removeEventListener("touchend", endHandler);
			// Ensure user select is re-enabled on unmount
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
		[leftWidth, isDragging],
	);

	// Timer effect
	useEffect(() => {
		if (isTimerRunning && !isTimerPaused) {
			timerRef.current = setInterval(() => {
				setTimer((prev) => prev + 1);
			}, 1000);
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isTimerRunning, isTimerPaused]);

	const handleTimerClick = () => {
		if (isTimerRunning) {
			if (isTimerPaused) {
				// Resume timer
				setIsTimerPaused(false);
			} else {
				// Pause timer
				setIsTimerPaused(true);
			}
		} else {
			// Start timer
			setIsTimerRunning(true);
			setIsTimerPaused(false);
		}
	};

	const handleStopTimer = () => {
		setIsTimerRunning(false);
		setIsTimerPaused(false);
		setTimer(0);
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Hàm xử lý nộp bài
	const handleSubmit = async () => {
		if (isSubmitting) return; // Ngăn chặn submit nhiều lần
		setIsSubmitting(true);

		try {
			const result = await submitAnswers(
				timer,
				content.de_bai || "", // Đảm bảo deBai là string
				questions,
				answers,
			);

			if (result.success) {
				// Optional: Chuyển hướng hoặc hiển thị thông báo thành công
				alert("Nộp bài thành công! Đang chuyển tới trang kết quả...");
			} else {
				console.error("Submission failed:", result.error);
				// Optional: Hiển thị thông báo lỗi
				alert(`Nộp bài thất bại, vui lòng thử lại!`);
			}
		} catch (error) {
			console.error("An error occurred during submission:", error);
			alert("Đã xảy ra lỗi không mong muốn khi nộp bài, vui lòng thử lại!");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Define the answer update handler with useCallback for stable reference
	const handleAnswersChange = useCallback(
		(newAnswers: Record<string, AnswerBlock[]>) => {
			setAnswers((prev) => ({ ...prev, ...newAnswers }));
		},
		[], // No dependencies, setAnswers is stable
	);

	return (
		<div className="bg-gray-100 flex min-h-screen flex-col">
			{/* Rotation Overlay */}
			<RotationOverlay isVisible={isClient && !isLandscape} />

			{/* Header */}
			<header className="bg-gray-100 border-black border-b">
				<div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
					<div className="py-4 flex items-center justify-between">
						{/* Logo */}
						<div className="gap-x-4 flex items-center">
							<div className="w-10 h-10 from-blue-600 to-purple-600 rounded-lg flex items-center justify-center bg-gradient-to-r">
								<span className="text-white text-xl font-bold">A</span>
							</div>
							<div className="text-2xl font-bold from-blue-600 to-purple-600 bg-gradient-to-r bg-clip-text text-transparent">
								The AllEd
							</div>
						</div>

						{/* Right side buttons */}
						<div className="space-x-4 flex items-center">
							{/* Timer Controls */}
							<div className="space-x-2 flex items-center">
								<button
									onClick={handleTimerClick}
									className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors duration-200 ${
										isTimerRunning
											? isTimerPaused
												? "bg-yellow-500 text-white hover:bg-yellow-600"
												: "bg-gray-200 text-gray-700 hover:bg-gray-300"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
								>
									{isTimerRunning ? (
										isTimerPaused ? (
											<FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
										) : (
											<FontAwesomeIcon icon={faPause} className="w-4 h-4" />
										)
									) : (
										"Bấm thời gian"
									)}
								</button>
								{isTimerRunning && (
									<button
										onClick={handleStopTimer}
										className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-colors duration-200"
									>
										<FontAwesomeIcon icon={faStop} className="w-4 h-4" />
									</button>
								)}
								{isTimerRunning && (
									<span className="text-gray-700 font-medium">
										{formatTime(timer)}
									</span>
								)}
							</div>

							{/* Submit Button */}
							<button
								onClick={handleSubmit}
								className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
									isSubmitting
										? "bg-gray-400 cursor-not-allowed"
										: "bg-green-500 hover:bg-green-600"
								}`}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Đang nộp..." : "Nộp bài"}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area using Resplit */}
			{isClient && (
				<div
					className="grid flex-1 overflow-hidden" // Use grid directly
					style={{
						gridTemplateColumns: `${leftWidth}px 1fr`, // Control columns via state
						position: "relative", // Needed for absolute positioning of ghost
					}}
				>
					{/* Left Panel */}
					<div
						className="bg-white shadow-md h-full overflow-hidden" // Keep styling
						style={{ direction: "rtl" }}
					>
						<div
							className="p-6 h-full overflow-y-auto"
							style={{ direction: "ltr" }}
						>
							<QuestionContent markdownContent={content.de_bai || ""} />
						</div>
					</div>

					{/* Splitter Handle */}
					<div
						onMouseDown={handleDragStart}
						onTouchStart={handleDragStart}
						className="top-0 bottom-0 w-2 bg-gray-300 hover:bg-blue-500 absolute cursor-col-resize"
						style={{
							left: `${leftWidth}px`, // Position handle based on state
							transform: "translateX(-50%)", // Center the handle visually
							zIndex: 20,
						}}
					/>

					{/* Ghost Bar - Rendered conditionally during custom drag */}
					{isDragging && ghostLeft !== null && (
						<div
							className="top-0 bottom-0 w-0.5 bg-blue-500 absolute opacity-75"
							style={{
								left: `${ghostLeft}px`, // Position ghost based on drag state
								zIndex: 30, // Ensure ghost is above handle and content
								pointerEvents: "none", // Prevent ghost from intercepting mouse events
							}}
						/>
					)}

					{/* Right Panel */}
					<div className="bg-gray-50 shadow-inner relative overflow-hidden">
						<div className="inset-0 p-6 absolute overflow-y-auto">
							<AnswerArea
								questions={questions}
								onAnswersChange={handleAnswersChange}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
