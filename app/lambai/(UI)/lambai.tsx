"use client";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import {
	faPause,
	faPlay,
	faStop,
	faSpinner,
	faCheckCircle,
	faExclamationCircle,
	faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnswerArea from "./AnswerArea";
import { submitAnswers, handler, saveWorkProgress } from "../(handler)/handler";
import { useOrientationCheck } from "./OrientationCheck";
import { RotationOverlay } from "./RotationOverlay";
import { useVirtualKeyboardPadding } from "./hooks/useVirtualKeyboardPadding";
import { animate } from "animejs";
import type { AnswerBlock } from "@/types";
import QuestionContent from "./components/QuestionContent";

export default function Home() {
	const [isBounded, setBounding] = useState<boolean>(false);
	const HeaderDropdownArrow = useRef<SVGSVGElement>(null);
	const [isHeaderVisible, setHeaderVisibility] = useState(true);
	const HeaderComponent = useRef<HTMLDivElement>(null);
	const HeaderInitialHeight = useRef<number>(0);
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
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [isClient, setIsClient] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [taskContent, setTaskContent] = useState<{
		de_bai: string;
		[key: string]: string;
	}>({ de_bai: "" });
	const answersRef = useRef(answers);
	const [saveStatus, setSaveStatus] = useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");
	const saveStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Get keyboard padding from the hook
	const keyboardPadding = useVirtualKeyboardPadding();

	// Kiểm tra hướng màn hình
	const isLandscape = useOrientationCheck();

	// Extract questions (all keys except de_bai)
	const questions = useMemo(() => {
		if (Object.keys(taskContent).length > 1) {
			const { de_bai: _de_bai, ...rest } = taskContent;
			return rest;
		}
		return {};
	}, [taskContent]);

	// Cập nhật ref mỗi khi answers thay đổi
	useEffect(() => {
		answersRef.current = answers;
	}, [answers]);

	// Khởi tạo kích thước ban đầu, fetch dữ liệu và tải lại bài làm
	useEffect(() => {
		const initialWidth = window.innerWidth / 2;
		setLeftWidth(initialWidth);
		setIsClient(true);

		const fetchData = async () => {
			setIsLoading(true);
			let fetchedTaskContent: { de_bai: string; [key: string]: string } = {
				de_bai: "Đang tải...",
			}; // Giá trị mặc định
			let fetchedAnswers: Record<string, AnswerBlock[]> = {};

			try {
				const response = await handler();
				if (response.status === "success" && response.data) {
					const taskData = response.data.task;
					const workData = response.data.work;

					// Parse task data
					try {
						const parsedTask = JSON.parse(taskData);
						if (
							typeof parsedTask === "object" &&
							parsedTask !== null &&
							parsedTask.de_bai !== undefined
						) {
							fetchedTaskContent = parsedTask;
						} else {
							console.error("Parsed task data is invalid:", parsedTask);
							fetchedTaskContent = { de_bai: "Lỗi định dạng đề bài." };
						}
					} catch (taskParseError) {
						console.error("Error parsing task data:", taskParseError);
						fetchedTaskContent = { de_bai: "Lỗi tải đề bài." };
					}

					// Tải lại bài làm nếu có
					if (workData) {
						try {
							const savedAnswers = JSON.parse(workData);
							if (typeof savedAnswers === "object" && savedAnswers !== null) {
								fetchedAnswers = savedAnswers;
							} // Không cần else vì mặc định là {}
							setBounding(true);
						} catch (parseError) {
							console.error(
								"Error parsing saved work:",
								parseError,
								"Workdata:",
								workData,
							);
							// Giữ fetchedAnswers là {}
						}
					}
				} else {
					console.error("Failed to fetch task:", response.message);
					fetchedTaskContent = { de_bai: "Không thể tải đề bài." };
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				fetchedTaskContent = { de_bai: "Lỗi kết nối." };
			} finally {
				setTaskContent(fetchedTaskContent);
				setAnswers(fetchedAnswers);
				answersRef.current = fetchedAnswers; // Cập nhật ref sau khi set state
				setIsLoading(false);
			}
		};

		fetchData();
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
		if (isSubmitting) return;
		setIsSubmitting(true);
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setIsTimerRunning(false);
		try {
			await submitAnswers(timer, taskContent.de_bai || "", questions, answers);
		} catch (error) {
			console.error("An error occurred during submission:", error);
			setIsSubmitting(false);
		}
	};

	// Define the answer update handler
	const handleAnswersChange = useCallback(
		(newAnswers: Record<string, AnswerBlock[]>) => {
			setAnswers((prev) => ({ ...prev, ...newAnswers }));
		},
		[],
	);

	// Hàm Lưu bài làm (cập nhật)
	const handleSave = useCallback(async () => {
		if (isLoading || !answersRef.current) return;

		// Xóa timeout cũ nếu đang hiển thị "Đã lưu"
		if (saveStatusTimeoutRef.current) {
			clearTimeout(saveStatusTimeoutRef.current);
			saveStatusTimeoutRef.current = null;
		}

		setSaveStatus("saving"); // Bắt đầu lưu

		const currentAnswers = answersRef.current;
		const jsonData = JSON.stringify(currentAnswers);

		try {
			const result = await saveWorkProgress(jsonData); // <<< Gọi và await server action
			if (result.success) {
				setSaveStatus("saved");
				// Tự động ẩn sau 2 giây
				saveStatusTimeoutRef.current = setTimeout(() => {
					setSaveStatus("idle");
					saveStatusTimeoutRef.current = null;
				}, 2000);
			} else {
				console.error("Save failed (server action):", result.error);
				setSaveStatus("error");
				// Tự động ẩn lỗi sau 3 giây
				saveStatusTimeoutRef.current = setTimeout(() => {
					setSaveStatus("idle");
					saveStatusTimeoutRef.current = null;
				}, 3000);
			}
		} catch (error) {
			console.error("Error calling saveWorkProgress:", error);
			setSaveStatus("error");
			// Tự động ẩn lỗi sau 3 giây
			saveStatusTimeoutRef.current = setTimeout(() => {
				setSaveStatus("idle");
				saveStatusTimeoutRef.current = null;
			}, 3000);
		}
	}, [isLoading]); // Dependency vẫn là isLoading

	// Lưu tự động (useEffect giữ nguyên, chỉ gọi handleSave mới)
	useEffect(() => {
		const intervalId = setInterval(() => {
			handleSave();
		}, 10000);
		return () => clearInterval(intervalId);
	}, [handleSave]);

	// Lưu thủ công Ctrl+S (useEffect giữ nguyên, chỉ gọi handleSave mới)
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "s") {
				event.preventDefault();
				handleSave();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleSave]);

	// Bỏ cảnh báo beforeunload (useEffect giữ nguyên)
	useEffect(() => {
		/* ... */
	}, []);

	// Lấy giá trị chiều cao ban đầu của HeaderComponent trước khi ẩn.
	useEffect(() => {
		if (!isBounded) return;
		if (HeaderComponent.current && !HeaderInitialHeight.current) {
			HeaderInitialHeight.current =
				HeaderComponent.current.getBoundingClientRect().height;
			setHeaderVisibility(false);
		}
	}, [isBounded]);

	// Áp dụng animejs vào việc tạo transition cho HeaderComponent
	useEffect(() => {
		if (
			HeaderComponent.current &&
			HeaderDropdownArrow.current &&
			HeaderInitialHeight.current
		) {
			if (isHeaderVisible) {
				animate(HeaderComponent.current, {
					height: {
						to: `${HeaderInitialHeight.current}px`,
					},
					duration: 150,
					loop: false,
				});
			} else {
				animate(HeaderComponent.current, {
					height: {
						to: "0px",
					},
					duration: 150,
					loop: false,
				});
			}
			animate(HeaderDropdownArrow.current, {
				rotate: "+=180deg",
				duration: 150,
				loop: false,
				frameRate: 120,
			});
		}
	}, [isHeaderVisible]);
	// Define spacer style once
	const spacerStyle: React.CSSProperties = {
		height: `${keyboardPadding}px`,
		transition: "height 150ms ease-in-out",
		flexShrink: 0, // Prevent shrinking in flex/grid contexts
		width: "100%", // Ensure it takes full width
	};

	return (
		<>
			{/* Screen rotation overlay - Thêm lại prop isVisible */}
			{!isLandscape && <RotationOverlay isVisible={isClient && !isLandscape} />}

			{/* Main layout */}
			<div
				className="flex h-screen flex-col overflow-hidden"
				style={{ paddingBottom: `${keyboardPadding}px` }} // Add keyboard padding
			>
				{/* Header Component - Giữ nguyên */}
				<header className="bg-gray-100 border-black relative h-fit border-b">
					<button
						type="button"
						onClick={() => setHeaderVisibility(!isHeaderVisible)}
						className="bg-white border-black text-gray-400! rounded-b-xl absolute top-full left-1/2 z-[1000] h-fit w-fit -translate-x-1/2 cursor-pointer border px-[1.5em]"
					>
						<FontAwesomeIcon
							ref={HeaderDropdownArrow}
							fixedWidth
							icon={faArrowDown}
						/>
					</button>

					<div
						ref={HeaderComponent}
						className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto transition-all"
					>
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

							{/* <<< THÊM Chỉ báo trạng thái lưu */}
							<div className="text-sm text-gray-500 absolute left-1/2 -translate-x-1/2 transform">
								{saveStatus === "saving" && (
									<span className="animate-pulse flex items-center">
										<FontAwesomeIcon icon={faSpinner} spin className="mr-1" />{" "}
										Đang lưu...
									</span>
								)}
								{saveStatus === "saved" && (
									<span className="text-green-600 flex items-center">
										<FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Đã
										lưu
									</span>
								)}
								{saveStatus === "error" && (
									<span className="text-red-600 flex items-center">
										<FontAwesomeIcon
											icon={faExclamationCircle}
											className="mr-1"
										/>{" "}
										Lỗi lưu bài!
									</span>
								)}
							</div>
						</div>
					</div>
				</header>

				{/* Content Area */}
				<div
					className="grid h-[calc(100vh-64px)] flex-grow overflow-hidden" // Adjust height calculation if header height changes
					style={{ gridTemplateColumns: `${leftWidth}px 1fr` }}
				>
					{/* Left Panel (Scrollable Question) */}
					<div
						className="bg-gray-50 h-full overflow-hidden"
						style={{ direction: "rtl" }}
					>
						<div
							className="p-6 h-full overflow-y-auto"
							style={{ direction: "ltr" }}
						>
							{isLoading ? (
								<div>Đang tải đề bài...</div>
							) : (
								<QuestionContent markdownContent={taskContent.de_bai} />
							)}
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
								questions={questions ?? {}}
								onAnswersChange={handleAnswersChange}
								initialAnswers={answers}
							/>
							{/* Spacer Div for Right Panel */}
							<div className="keyboard-spacer-right" style={spacerStyle} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
