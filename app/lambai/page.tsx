"use client";
import Image from "next/image";
import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	SyntheticEvent,
} from "react";
import { ResizableBox } from "react-resizable";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "react-resizable/css/styles.css";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import test from "@/test.json";

const config = {
	loader: { load: ["[tex]/html"] },
	tex: {
		packages: { "[+]": ["html"] },
		inlineMath: [["$", "$"]],
		displayMath: [["$$", "$$"]],
	},
};

// Tách phần nội dung MathJax thành component riêng
const QuestionContent = () => {
	const content = useMemo(
		() => (
			<div className="space-y-4 text-gray-900">
				<p className="font-medium">
					<MathJax inline>
						{
							"Cho hàm số $f(x) = x^3 - 3x^2 + 2x + 1$. Tìm tất cả các giá trị của tham số $m$ để phương trình $f(x) = m$ có ba nghiệm phân biệt."
						}
					</MathJax>
					<MathJax>{`$$${test.latex}$$`}</MathJax>
				</p>
				<p className="font-semibold">Giải:</p>
				<p className="font-medium">
					<MathJax inline>
						{
							"Để phương trình $f(x) = m$ có ba nghiệm phân biệt, ta cần tìm các giá trị của $m$ sao cho đường thẳng $y = m$ cắt đồ thị hàm số $y = f(x)$ tại ba điểm phân biệt."
						}
					</MathJax>
				</p>
				<p className="font-medium">
					Ta có:
					<MathJax>{"$$f'(x) = 3x^2 - 6x + 2$$"}</MathJax>
					<MathJax>{"$$f''(x) = 6x - 6$$"}</MathJax>
				</p>
			</div>
		),
		[],
	); // Empty dependency array vì nội dung không thay đổi

	return content;
};

export default function Home() {
	const [leftWidth, setLeftWidth] = useState(0);
	const [showMathToolbar, setShowMathToolbar] = useState(false);
	const [showFavorites, setShowFavorites] = useState(false);

	// Khởi tạo kích thước ban đầu
	useEffect(() => {
		setLeftWidth(window.innerWidth / 2);
	}, []);

	// Tối ưu hàm resize
	const handleResize = useCallback(
		(
			e: SyntheticEvent<Element, Event>,
			{ size }: { size: { width: number } },
		) => {
			setLeftWidth(size.width);
		},
		[],
	);

	return (
		<div className="bg-gray-100 min-h-screen">
			{/* Main Content Area */}
			<div className="grid h-[calc(100vh-120px)] grid-cols-[auto_1fr]">
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
							<div className="min-h-0 flex-1">
								<div className="prose h-full max-w-none">
									<MathJaxContext config={config}>
										<QuestionContent />
									</MathJaxContext>
								</div>
							</div>
						</div>
					</ResizableBox>
				</div>

				{/* Right Panel - Answer Area */}
				<div className="bg-white p-6 flex-1">
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
					<div className="h-[calc(100%-3rem)]">
						<textarea
							className="p-4 focus:ring-blue-500 text-gray-900 font-medium h-full w-full resize-none overflow-y-auto focus:ring-2 focus:outline-none"
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
