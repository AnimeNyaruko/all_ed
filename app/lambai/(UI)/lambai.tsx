"use client";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
// Tách phần nội dung MathJax thành component riêng
const QuestionContent = ({ markdownContent }: { markdownContent: string }) => {
	const content = useMemo(
		() => (
			<div
				className="space-y-4 text-gray-900"
				style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
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
	const [showMathToolbar, setShowMathToolbar] = useState(false);
	const [showFavorites, setShowFavorites] = useState(false);

	// Khởi tạo kích thước ban đầu
	useEffect(() => {
		setLeftWidth(window.innerWidth / 2);
	}, []);

	// Tối ưu hàm resize
	const handleResize = useCallback(
		(_e: React.SyntheticEvent, { size }: { size: { width: number } }) => {
			setLeftWidth(size.width);
		},
		[],
	);

	// Tính toán chiều cao phù hợp để không bị footer che
	const toolbarHeight = 64; // Chiều cao của toolbar ở dưới
	const padding = 1; // Thêm padding để đảm bảo không bị sát footer

	return (
		<div className="bg-gray-100 flex min-h-screen flex-col">
			{/* Main Content Area */}
			<div className="flex h-[calc(100vh-64px-20px)] flex-1">
				{/* Left Panel - Question Area */}
				<div className="relative">
					<ResizableBox
						width={leftWidth}
						height={Infinity}
						minConstraints={[300, Infinity]}
						maxConstraints={[800, Infinity]}
						onResize={handleResize}
						axis="x"
						lockAspectRatio={false}
						handle={
							<div className="right-0 top-0 bottom-0 w-2 bg-gray-300 hover:bg-blue-500 absolute cursor-col-resize transition-colors duration-200" />
						}
					>
						<div className="bg-white p-6 flex h-full flex-col">
							<div className="space-x-2 mb-4 flex items-center">
								<div className="space-x-2 flex items-center">
									<FontAwesomeIcon
										icon={faClipboard}
										className="text-xl text-blue-500 font-bold"
									/>
									<span className="text-base font-semibold text-gray-700">
										de-bai.txt
									</span>
								</div>
								<span className="text-gray-300">-</span>
								<span className="text-sm text-gray-500">The AllEd</span>
							</div>
							<div
								className="min-h-0 pb-4 pr-2 flex-1 overflow-auto"
								style={{
									maxHeight: `calc(100vh - ${toolbarHeight + padding + 100}px)`,
								}}
							>
								<div className="prose max-w-none overflow-visible">
									<QuestionContent markdownContent={markdownContent} />
								</div>
							</div>
						</div>
					</ResizableBox>
				</div>

				{/* Right Panel - Answer Area */}
				<div className="bg-white p-6 flex flex-1 flex-col">
					<div className="space-x-2 mb-4 flex items-center">
						<div className="space-x-2 flex items-center">
							<FontAwesomeIcon
								icon={faClipboard}
								className="text-xl text-blue-500 font-bold"
							/>
							<span className="text-base font-semibold text-gray-700">
								bai-lam.txt
							</span>
						</div>
						<span className="text-gray-300">-</span>
						<span className="text-sm text-gray-500">The AllEd</span>
					</div>
					<div
						className="pb-4 flex-1 overflow-auto"
						style={{
							maxHeight: `calc(100vh - ${toolbarHeight + padding + 120}px)`,
						}}
					>
						<textarea
							className="p-4 focus:ring-blue-500 text-gray-900 font-medium h-full w-full resize-none focus:ring-2 focus:outline-none"
							placeholder="Nhập bài làm của bạn ở đây..."
						/>
					</div>
				</div>
			</div>

			{/* Math Toolbar */}
			<div className="bottom-0 left-0 right-0 bg-gray-800 text-white fixed">
				<div className="px-4 py-2 flex items-center justify-between">
					<div className="space-x-4 flex items-center">
						{/* Logo */}
						<div className="w-8 h-8 ml-2">
							<Image
								src="/logo.png"
								alt="Logo"
								width={32}
								height={32}
								className="rounded"
							/>
						</div>

						{/* Search Bar */}
						<div className="w-[300px]">
							<input
								type="text"
								placeholder="Tìm kiếm công thức toán học..."
								className="px-4 py-2 rounded bg-gray-700 focus:ring-blue-500 text-white placeholder:text-gray-300 font-medium w-full focus:ring-2 focus:outline-none"
							/>
						</div>

						{/* Math Function Display */}
						<div className="relative">
							<button
								onClick={() => setShowMathToolbar(!showMathToolbar)}
								className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-lg font-mono"
								title="Hiển thị hàm"
							>
								f(x)
							</button>
							{showMathToolbar && (
								<div className="left-0 mb-2 bg-gray-700 p-4 rounded shadow-lg absolute bottom-full">
									{/* Danh sách các hàm toán học */}
								</div>
							)}
						</div>

						{/* Favorites */}
						<div className="relative">
							<button
								onClick={() => setShowFavorites(!showFavorites)}
								className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
							>
								⭐
							</button>
							{showFavorites && (
								<div className="right-0 mb-2 bg-gray-700 p-4 rounded shadow-lg absolute bottom-full">
									{/* Danh sách các hàm yêu thích */}
								</div>
							)}
						</div>
					</div>

					{/* Submit Button */}
					<button className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold space-x-2 flex items-center transition-colors duration-200">
						<span>Nộp bài</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
