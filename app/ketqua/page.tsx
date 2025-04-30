"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheck,
	faTimes,
	faHome,
	faEdit,
	faRedo,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Header from "@/ui/Components/Header";
import Footer from "@/ui/Components/Footer";

export default function Page() {
	// Mock data - thực tế nên lấy từ API hoặc context
	const [result, _setResult] = useState({
		correctAnswers: 7,
		totalQuestions: 10,
		percentage: 70,
		completionTime: {
			minutes: 12,
			seconds: 30,
		},
		questions: [
			{
				id: 1,
				question: "Thủ đô của Việt Nam là gì?",
				userAnswer: "Hà Nội",
				isCorrect: true,
			},
			{
				id: 2,
				question: "2 + 2 = ?",
				userAnswer: "4",
				isCorrect: true,
			},
			{
				id: 3,
				question: "Năm nào Việt Nam hoàn toàn thống nhất đất nước?",
				userAnswer: "1976",
				isCorrect: false,
			},
			{
				id: 4,
				question: "Quốc khánh Việt Nam là ngày nào?",
				userAnswer: "2/9",
				isCorrect: true,
			},
			{
				id: 5,
				question: "Ai là người đầu tiên đặt chân lên mặt trăng?",
				userAnswer: "Neil Armstrong",
				isCorrect: true,
			},
			{
				id: 6,
				question: "Sông dài nhất Việt Nam là sông gì?",
				userAnswer: "Sông Hồng",
				isCorrect: false,
			},
			{
				id: 7,
				question: "Tây Nguyên gồm bao nhiêu tỉnh?",
				userAnswer: "5",
				isCorrect: true,
			},
			{
				id: 8,
				question: "Ai là tác giả của Truyện Kiều?",
				userAnswer: "Nguyễn Du",
				isCorrect: true,
			},
			{
				id: 9,
				question: "Bao nhiêu tỉnh thành ở Việt Nam?",
				userAnswer: "62",
				isCorrect: false,
			},
			{
				id: 10,
				question: "H2O là gì?",
				userAnswer: "Nước",
				isCorrect: true,
			},
		],
	});

	return (
		<>
			<Header />
			<main className="px-4 py-8 max-w-5xl page-content-with-fixed-header container mx-auto">
				<div className="bg-white shadow-md rounded-lg p-6 mb-8">
					{/* Kết quả tổng quan */}
					<div className="md:flex-row md:justify-between mb-8 flex flex-col items-center justify-center">
						<div className="md:text-left mb-6 md:mb-0 text-center">
							{result.percentage > 50 ? (
								<div className="w-24 h-24 md:w-32 md:h-32 bg-green-100 md:mx-0 mb-4 mx-auto flex items-center justify-center rounded-full">
									<FontAwesomeIcon
										icon={faCheck}
										className="text-green-500 text-4xl md:text-5xl"
									/>
								</div>
							) : (
								<div className="w-24 h-24 md:w-32 md:h-32 bg-red-100 md:mx-0 mb-4 mx-auto flex items-center justify-center rounded-full">
									<FontAwesomeIcon
										icon={faTimes}
										className="text-red-500 text-4xl md:text-5xl"
									/>
								</div>
							)}
						</div>

						<div className="md:text-left text-center">
							<h1 className="text-2xl md:text-3xl font-bold mb-2">
								Bạn đã trả lời đúng {result.correctAnswers}/
								{result.totalQuestions} câu ({result.percentage}%).
							</h1>
							<p className="text-gray-600 text-lg">
								Thời gian hoàn thành: {result.completionTime.minutes} phút{" "}
								{result.completionTime.seconds} giây
							</p>
						</div>
					</div>

					{/* Thanh progress */}
					<div className="bg-gray-200 h-4 mb-6 w-full rounded-full">
						<div
							className={`h-4 rounded-full ${result.percentage > 50 ? "bg-green-500" : "bg-red-500"}`}
							style={{ width: `${result.percentage}%` }}
						></div>
					</div>

					{/* Các nút điều hướng */}
					<div className="gap-4 mb-8 flex flex-wrap justify-center">
						<Link
							href="/"
							className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2 flex items-center transition"
						>
							<FontAwesomeIcon icon={faHome} />
							<span>Màn hình chính</span>
						</Link>
						<Link
							href="/taobai"
							className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 gap-2 flex items-center transition"
						>
							<FontAwesomeIcon icon={faEdit} />
							<span>Trang tạo bài</span>
						</Link>
						<Link
							href="/lambai"
							className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 gap-2 flex items-center transition"
						>
							<FontAwesomeIcon icon={faRedo} />
							<span>Làm lại</span>
						</Link>
					</div>

					{/* Danh sách câu hỏi */}
					<h2 className="text-xl font-bold mb-4">Chi tiết kết quả:</h2>
					<div className="space-y-4">
						{result.questions.map((question) => (
							<div
								key={question.id}
								className={`p-4 rounded-lg border ${question.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
							>
								<div className="flex items-start justify-between">
									<h3 className="font-medium text-lg">
										Câu {question.id}: {question.question}
									</h3>
									<div
										className={`w-6 h-6 flex items-center justify-center rounded-full ${
											question.isCorrect ? "bg-green-500" : "bg-red-500"
										}`}
									>
										<FontAwesomeIcon
											icon={question.isCorrect ? faCheck : faTimes}
											className="text-white text-xs"
										/>
									</div>
								</div>
								<div className="mt-2">
									<p className="text-gray-700">
										<span className="font-medium">Câu trả lời của bạn:</span>{" "}
										{question.userAnswer}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
