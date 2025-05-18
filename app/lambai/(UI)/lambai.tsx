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
import { usePanelResizer } from "./hooks/usePanelResizer";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import clsx from "clsx";
import TutorialModal from "./components/Tutorial";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function Home() {
	const [isBounded, setBounding] = useState<boolean>(false);
	const HeaderDropdownArrow = useRef<SVGSVGElement>(null);
	const [isHeaderVisible, setHeaderVisibility] = useState(false);
	const HeaderComponent = useRef<HTMLDivElement>(null);
	const HeaderInitialHeight = useRef<number>(0);
	const { showToast } = useToast();

	// Default width for server-side and initial client render
	const SERVER_DEFAULT_LEFT_WIDTH = 500;

	// State for initialLeftWidth, to be updated on client after mount
	const [calculatedInitialLeftWidth, setCalculatedInitialLeftWidth] = useState(
		SERVER_DEFAULT_LEFT_WIDTH,
	);

	// Use the custom hook for resizing logic
	const { leftWidth, isDragging, ghostLeft, handleDragStart } = usePanelResizer(
		{ initialWidth: calculatedInitialLeftWidth },
	);

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
	const fullscreenHandle = useFullScreenHandle();
	const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
	const [promptActionTakenThisSession, setPromptActionTakenThisSession] =
		useState(false);

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
		setIsClient(true);

		// Update initialLeftWidth on the client after mount
		// This ensures server and initial client render match, then client updates.
		const clientCalculatedWidth = (() => {
			const savedWidth = localStorage.getItem("leftPanelWidth");
			if (savedWidth) {
				const parsedWidth = parseInt(savedWidth, 10);
				if (!isNaN(parsedWidth) && parsedWidth > 0) {
					return parsedWidth;
				}
			}
			return window.innerWidth / 2;
		})();
		setCalculatedInitialLeftWidth(clientCalculatedWidth);

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

	// Effect to show fullscreen prompt when landscape and not already fullscreen
	useEffect(() => {
		if (isClient) {
			if (promptActionTakenThisSession) {
				// If action taken this session, and prompt is somehow visible, hide it.
				// This also prevents it from showing again in this session.
				if (showFullscreenPrompt) {
					setShowFullscreenPrompt(false);
				}
				return; // Exit: No further action needed regarding the prompt for this session.
			}

			// If action has NOT been taken yet this session:
			const shouldShow = isLandscape && !fullscreenHandle.active;
			if (shouldShow && !showFullscreenPrompt) {
				setShowFullscreenPrompt(true);
			} else if (!shouldShow && showFullscreenPrompt) {
				setShowFullscreenPrompt(false);
			}
		}
	}, [
		isLandscape,
		fullscreenHandle.active,
		isClient,
		showFullscreenPrompt,
		promptActionTakenThisSession,
	]);

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
	const handleSubmit = useCallback(async () => {
		setIsSubmitting(true);
		setIsTimerRunning(false);
		setIsTimerPaused(false);
		showToast("Đang nộp bài...", "loading");

		try {
			const result = await submitAnswers(
				timer,
				taskContent.de_bai,
				questions,
				answersRef.current,
			);

			if (result.status === "success") {
				showToast("Nộp bài thành công!", "success");
				redirect("/ketqua");
			} else {
				showToast("Lỗi: Không thể nộp bài", "error");
			}
		} catch (error) {
			console.error("Submit error:", error);
			showToast("Lỗi: Không thể nộp bài", "error");
		} finally {
			setIsSubmitting(false);
		}
	}, [timer, taskContent.de_bai, questions, showToast]);

	// Hàm lưu tiến độ bài làm
	const handleSaveProgress = useCallback(async () => {
		setSaveStatus("saving");
		if (saveStatusTimeoutRef.current) {
			clearTimeout(saveStatusTimeoutRef.current);
		}
		try {
			const jsonData = JSON.stringify(answersRef.current);
			const result = await saveWorkProgress(jsonData);

			if (result.status === "success") {
				setSaveStatus("saved");
			} else {
				console.error("Save progress error:", result.message);
				setSaveStatus("error");
			}
		} catch (error) {
			console.error("Failed to save progress:", error);
			setSaveStatus("error");
		} finally {
			saveStatusTimeoutRef.current = setTimeout(() => {
				setSaveStatus("idle");
			}, 2000);
		}
	}, []);

	// Debounced handler for answer changes from AnswerArea
	const handleAnswersChange = useCallback(
		(newAnswerData: Record<string, AnswerBlock[]>) => {
			setAnswers((prevAnswers) => {
				const updatedAnswers = { ...prevAnswers, ...newAnswerData };
				return updatedAnswers;
			});
			handleSaveProgress();
		},
		[handleSaveProgress],
	);

	// Lưu tự động (useEffect giữ nguyên, chỉ gọi handleSave mới)
	useEffect(() => {
		const intervalId = setInterval(() => {
			handleSaveProgress();
		}, 10000);
		return () => clearInterval(intervalId);
	}, [handleSaveProgress]);

	// Lưu thủ công Ctrl+S (useEffect giữ nguyên, chỉ gọi handleSave mới)
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "s") {
				event.preventDefault();
				handleSaveProgress();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleSaveProgress]);

	// Bỏ cảnh báo beforeunload (useEffect giữ nguyên)
	useEffect(() => {
		/* ... */
	}, []);

	// Lấy giá trị chiều cao ban đầu của HeaderComponent khi mount.
	useEffect(() => {
		// Chạy một lần khi component mount để lấy chiều cao
		if (HeaderComponent.current && !HeaderInitialHeight.current) {
			HeaderInitialHeight.current =
				HeaderComponent.current.getBoundingClientRect().height;
			// Không setHeaderVisibility(false) ở đây nữa vì trạng thái ban đầu đã là false
		}
	}, []); // <-- Chạy một lần khi mount

	// Áp dụng animejs vào việc tạo transition cho HeaderComponent và mũi tên
	useEffect(() => {
		// Animation cho chiều cao header (phụ thuộc vào initialHeight)
		if (HeaderComponent.current && HeaderInitialHeight.current) {
			if (isHeaderVisible) {
				animate(HeaderComponent.current, {
					height: {
						to: `${HeaderInitialHeight.current}px`,
					},
					// overflow: 'visible', // Tạm thời cho phép overflow khi mở rộng
					duration: 150,
					loop: false,
					// complete: (anim) => {
					// 	if (isHeaderVisible && HeaderComponent.current) {
					// 		HeaderComponent.current.style.overflow = 'visible';
					// 	}
					// }
				});
			} else {
				animate(HeaderComponent.current, {
					height: {
						to: "0px",
					},
					// overflow: 'hidden', // Ẩn overflow khi thu gọn
					duration: 150,
					loop: false,
					// begin: (anim) => {
					// 	if (!isHeaderVisible && HeaderComponent.current) {
					// 		HeaderComponent.current.style.overflow = 'hidden';
					// 	}
					// }
				});
			}
		}
		// Animation cho mũi tên (chỉ phụ thuộc isHeaderVisible và ref)
		if (HeaderDropdownArrow.current) {
			animate(HeaderDropdownArrow.current, {
				rotate: isHeaderVisible ? "0deg" : "180deg", // Xoay đến vị trí cụ thể thay vì +=
				duration: 150,
				loop: false,
				frameRate: 120,
			});
		}
	}, [isHeaderVisible]); // <-- Chỉ phụ thuộc vào isHeaderVisible

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

			{/* Fullscreen Prompt Modal */}
			{showFullscreenPrompt && (
				<div className="inset-0 bg-black bg-opacity-50 fixed z-[2000] flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-xl text-center">
						<h3 className="text-lg font-semibold mb-4">Chế độ Toàn Màn Hình</h3>
						<p className="mb-4">
							Bạn có muốn chuyển sang chế độ toàn màn hình để làm bài tốt hơn
							không?
						</p>
						<div className="space-x-4 flex justify-center">
							<button
								onClick={() => {
									fullscreenHandle.enter();
									setShowFullscreenPrompt(false);
									setPromptActionTakenThisSession(true);
								}}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
							>
								Có
							</button>
							<button
								onClick={() => {
									setShowFullscreenPrompt(false);
									setPromptActionTakenThisSession(true);
								}}
								className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
							>
								Để sau
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Main layout wrapped in FullScreen component */}
			<FullScreen handle={fullscreenHandle}>
				<div
					// Apply a background color if in fullscreen mode to ensure content visibility
					// The FullScreen component itself is transparent by default
					className={`flex h-screen flex-col overflow-hidden ${
						fullscreenHandle.active ? "bg-white" : ""
					}`}
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
							className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto"
						>
							<div className="py-4 flex items-center justify-between">
								{/* Logo */}
								<Link
									href="/"
									className="gap-x-4 flex cursor-pointer items-center"
								>
									<div className="w-10 h-10 from-blue-600 to-purple-600 rounded-lg flex items-center justify-center bg-gradient-to-r">
										<span className="text-white text-xl font-bold">A</span>
									</div>
									<div className="text-2xl font-bold from-blue-600 to-purple-600 bg-gradient-to-r bg-clip-text text-transparent">
										The AllEd
									</div>
								</Link>

								{/* Right side buttons */}
								<div className="space-x-3 flex items-center">
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

									{/* Fullscreen Button */}
									<button
										onClick={() =>
											fullscreenHandle.active
												? fullscreenHandle.exit()
												: fullscreenHandle.enter()
										}
										className={clsx(
											`px-6 py-2 rounded-lg font-semibold text-white cursor-pointer transition-colors duration-200`,
											{
												"bg-green-500 hover:bg-green-600":
													!fullscreenHandle.active,
												"bg-red-500 hover:bg-red-600": fullscreenHandle.active,
											},
										)}
									>
										{fullscreenHandle.active
											? "Thoát toàn màn hình"
											: "Toàn màn hình"}
									</button>

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

									{/* <<< TutorialModal moved here (right of Submit button) */}
									<TutorialModal />
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
											<FontAwesomeIcon icon={faCheckCircle} className="mr-1" />{" "}
											Đã lưu
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

					{/* Content Area - Thêm 'relative' vào đây */}
					<div
						className="relative grid h-[calc(100vh-64px)] flex-grow overflow-hidden" // <-- Thêm 'relative'
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

						{/* Scrollbar */}
						<div
							className="bg-gray-300 hover:bg-blue-600 absolute z-10 flex h-full w-[10px] cursor-col-resize items-center justify-center"
							style={{ left: leftWidth }}
							onMouseDown={handleDragStart}
							onTouchMove={handleDragStart}
						>
							<div className="bg-blue-600 h-[30px] w-[35%] rounded-full" />
						</div>
						{isDragging && (
							<div
								className="bg-blue-600 absolute z-50 h-full w-[2.5px]"
								style={{ left: ghostLeft ? ghostLeft : leftWidth }}
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
				{/* Spacer for main layout's keyboard padding - might not be needed if padding is on the inner div */}
				{/* <div style={spacerStyle} /> */}
			</FullScreen>
		</>
	);
}
