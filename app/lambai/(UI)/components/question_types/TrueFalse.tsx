"use client";
import { FC, useState } from "react";
import clsx from "clsx";

interface TrueFalseProps {
	question: {
		id: string;
		content: string;
		sub_questions?: string[];
	};
	questionNumber: number;
	onChange: (questionId: string, answer: Record<number, boolean>) => void;
}

const TrueFalse: FC<TrueFalseProps> = ({
	question,
	questionNumber,
	onChange,
}) => {
	const [answers, setAnswers] = useState<Record<number, boolean>>({});

	const handleAnswerChange = (subQuestionIndex: number, answer: boolean) => {
		setAnswers((prev) => {
			const newAnswers = { ...prev };
			// Allow un-selecting by clicking the same option again
			if (newAnswers[subQuestionIndex] === answer) {
				delete newAnswers[subQuestionIndex];
			} else {
				newAnswers[subQuestionIndex] = answer;
			}
			onChange(question.id, newAnswers);
			return newAnswers;
		});
	};

	return (
		<div className="p-4 my-2">
			<p className="mb-4 text-base font-medium">
				<span className="font-bold mr-2">{`Câu ${questionNumber}:`}</span>
				{question.content}
			</p>

			<div className="w-full">
				{/* Header */}
				<div className="flex items-center mb-2">
					<div className="flex-grow"></div>
					<div className="grid grid-cols-2 text-center flex-shrink-0 w-32">
						<span className="font-semibold text-gray-700">Đúng</span>
						<span className="font-semibold text-gray-700">Sai</span>
					</div>
				</div>

				{/* Sub-questions */}
				<div className="space-y-3">
					{question.sub_questions?.map((subQuestion, index) => {
						const choiceLetter = String.fromCharCode(97 + index); // a, b, c, d
						return (
							<div key={index} className="flex items-center">
								{/* Question Text */}
								<div className="flex-grow flex items-start space-x-2 pr-4">
									<span className="font-medium mt-1">{`${choiceLetter})`}</span>
									<p className="text-gray-800 flex-1">{subQuestion}</p>
								</div>
								{/* Buttons */}
								<div className="grid grid-cols-2 place-items-center flex-shrink-0 w-32">
									{/* True Button */}
									<div
										onClick={() => handleAnswerChange(index, true)}
										className={clsx(
											"w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center",
											answers[index] === true
												? "border-orange-500 bg-orange-500"
												: "border-gray-400 hover:border-orange-400",
										)}
									>
										{answers[index] === true && (
											<div className="w-3 h-3 bg-white rounded-full"></div>
										)}
									</div>
									{/* False Button */}
									<div
										onClick={() => handleAnswerChange(index, false)}
										className={clsx(
											"w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center",
											answers[index] === false
												? "border-orange-500 bg-orange-500"
												: "border-gray-400 hover:border-orange-400",
										)}
									>
										{answers[index] === false && (
											<div className="w-3 h-3 bg-white rounded-full"></div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default TrueFalse; 