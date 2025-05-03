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
import { ResultData } from "@/types";
import { latexParser } from "@/utils/latexParser";
import MixedContentRenderer from "./MixedContentRenderer";
import { re_create, re_work } from "../(handler)/handler";

export default function ResultPage({ result }: { result: ResultData }) {
	const parsedDeBai = latexParser(result.de_bai);

	return (
		<>
			<Header />
			<main className="px-4 py-8 max-w-5xl page-content-with-fixed-header container mx-auto">
				<div className="bg-white shadow-md rounded-lg p-6 mb-8">
					{/* Kết quả tổng quan */}
					<div className="md:flex-row md:justify-between mb-8 flex flex-col items-center justify-center">
						<div className="md:text-left mb-6 md:mb-0 text-center">
							{result.percentage >= 50 ? (
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
								Thời gian hoàn thành: {result.completionTime}
							</p>
						</div>
					</div>

					{/* Thanh progress */}
					<div className="bg-gray-200 h-4 mb-6 w-full rounded-full">
						<div
							className={`h-4 rounded-full ${result.percentage >= 50 ? "bg-green-500" : "bg-red-500"}`}
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
						<button
							onClick={re_create}
							className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 gap-2 flex cursor-pointer items-center transition"
						>
							<FontAwesomeIcon icon={faEdit} />
							<span>Trang tạo bài</span>
						</button>
						<button
							onClick={re_work}
							className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 gap-2 flex cursor-pointer items-center transition"
						>
							<FontAwesomeIcon icon={faRedo} />
							<span>Làm lại</span>
						</button>
					</div>

					{/* Hiển thị Đề bài chung */}
					<div className="mb-6 p-4 border-gray-300 rounded-md bg-gray-50 border">
						<h2 className="text-xl font-semibold mb-2">Đề bài:</h2>
						<MixedContentRenderer
							data={parsedDeBai}
							className="text-gray-800"
						/>
					</div>

					{/* Danh sách câu hỏi chi tiết */}
					<h2 className="text-xl font-bold mb-4">Chi tiết kết quả:</h2>
					<div className="space-y-4">
						{result.questions.map((question, index) => {
							const parsedUserAnswer = latexParser(question.userAnswer);
							const parsedCorrectAnswer = latexParser(question.correctAnswer);
							const parsedSubQuestion = latexParser(question.subQuestion);

							return (
								<div
									key={question.id || index}
									className={`p-4 rounded-lg border ${question.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
								>
									<div className="mb-2 flex items-start justify-between">
										<h3 className="font-medium text-lg">
											<MixedContentRenderer data={parsedSubQuestion} />
										</h3>
										<div
											className={`w-6 h-6 flex flex-shrink-0 items-center justify-center rounded-full ${
												question.isCorrect ? "bg-green-500" : "bg-red-500"
											}`}
										>
											<FontAwesomeIcon
												icon={question.isCorrect ? faCheck : faTimes}
												className="text-white text-xs"
											/>
										</div>
									</div>
									<div className="mt-2 space-y-1">
										<div className="text-gray-700 flex flex-wrap items-center">
											<span className="font-medium mr-1">
												Câu trả lời của bạn:
											</span>
											<MixedContentRenderer data={parsedUserAnswer} />
										</div>
										<div
											className={`text-gray-700 flex flex-wrap items-center ${question.isCorrect ? "text-green-700" : "text-red-700"}`}
										>
											<span className="font-medium mr-1">Đáp án đúng:</span>
											<MixedContentRenderer data={parsedCorrectAnswer} />
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
}
