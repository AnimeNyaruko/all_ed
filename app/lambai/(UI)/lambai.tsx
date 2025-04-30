"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import AnswerArea from "./AnswerArea";
import { submitAnswers } from "../(handler)/handler";
import type { AnswerBlock, FormattedOutput, QuestionStructure } from "../types";

// Tách phần nội dung MathJax thành component riêng
const QuestionContent = ({ markdownContent }: { markdownContent: string }) => {
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
};

export default function Home({ markdownContent }: { markdownContent: string }) {
	const [leftWidth, setLeftWidth] = useState(0);
	const [answers, setAnswers] = useState<Record<string, AnswerBlock[]>>({});
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [isTimerPaused, setIsTimerPaused] = useState(false);
	const [timer, setTimer] = useState(0);
	const timerRef = useRef<NodeJS.Timeout>(null);
	const [isClient, setIsClient] = useState(false);

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
		console.log("Extracted (but unused) de_bai:", _de_bai);
		return rest;
	}, [content]);

	// Khởi tạo kích thước ban đầu & Set client state
	useEffect(() => {
		setLeftWidth(window.innerWidth / 2);
		setIsClient(true);
	}, []);

	// Tối ưu hàm resize
	const handleResize = useCallback(
		// The first argument (event) is unused, only take the data object
		(_: React.SyntheticEvent, data: { size: { width: number } }) => {
			const { size } = data;
			setLeftWidth(size.width);
		},
		[],
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

	const handleSubmit = async () => {
		console.log("Submitting answers (client-side):", answers);
		console.log("Original content (client-side):", content);
		try {
			// --- PHASE 1 START: Pass both content and answers ---
			const formattedOutput: FormattedOutput = {
				de_bai: content?.de_bai || "",
			};
			Object.keys(content).forEach((key) => {
				// Skip the top-level 'de_bai' key itself
				if (key === "de_bai") {
					return;
				}

				// Get the data for the original sub-question (e.g., content['cau_a'])
				const originalQuestionData = content[key];
				let originalQuestionText = "";

				// Safely extract the 'de_bai' text for the sub-question
				// Check if it's an object and has the 'de_bai' property
				if (
					typeof originalQuestionData === "object" &&
					originalQuestionData !== null &&
					"de_bai" in originalQuestionData
				) {
					// Type assertion might be needed if TypeScript can't infer QuestionStructure here
					originalQuestionText =
						(originalQuestionData as QuestionStructure).de_bai || "";
				} else {
					// This case shouldn't happen based on the expected structure, but good to handle
					console.warn(
						`Expected structure not found for key "${key}" in content.`,
					);
					// Optionally continue to next key or handle differently
					return;
				}

				// Look up the submitted answers for this specific key (e.g., answers['cau_a'])
				// Default to an empty array if no answer was submitted for this key
				const answerBlocks = answers[key] || [];

				// Concatenate the content of the submitted answer blocks.
				// This will result in an empty string ("") if answerBlocks is empty.
				const submittedAnswerContent = answerBlocks
					.map((block) => block.content)
					.join("");

				// Add the entry to the formatted output, ensuring it exists even if bai_lam is empty
				formattedOutput[key] = {
					de_bai: originalQuestionText,
					bai_lam: submittedAnswerContent,
				};
			});
			const result = await submitAnswers(formattedOutput, answers);
			// --- PHASE 1 END ---
			console.log("Server action result:", result);
		} catch (error) {
			console.error("Error calling submitAnswers:", error);
		}
	};

	return (
		<div className="bg-gray-100 flex min-h-screen flex-col">
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
								className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-white transition-colors duration-200"
							>
								Nộp bài
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<div
				className="grid h-[calc(100vh-64px)] overflow-hidden"
				style={{ gridTemplateColumns: `${leftWidth}px 1fr` }}
			>
				{/* Left Panel - Question Area */}
				<div className="relative overflow-hidden">
					<ResizableBox
						width={leftWidth}
						onResize={handleResize}
						axis="x"
						minConstraints={[300, Infinity]}
						maxConstraints={[800, Infinity]}
						handle={
							<div className="right-0 top-0 bottom-0 w-2 bg-gray-300 hover:bg-blue-500 absolute cursor-col-resize transition-colors duration-200" />
						}
					>
						<div
							className="bg-white p-6 h-full"
							style={{ overflowY: "auto", direction: "rtl" }}
						>
							<QuestionContent markdownContent={content.de_bai} />
						</div>
					</ResizableBox>
				</div>

				{/* Right Panel - Answer Area */}
				<div className="bg-white p-6 relative overflow-hidden">
					<div className="inset-0 p-6 absolute overflow-y-auto">
						{isClient && (
							<AnswerArea
								questions={questions}
								onAnswersChange={(newAnswers) =>
									setAnswers((prev) => ({ ...prev, ...newAnswers }))
								}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
