"use client";
import { FC, useState } from "react";
import clsx from "clsx";

interface MultipleChoiceProps {
	question: {
		id: string;
		content: string;
		options: string[];
	};
	questionNumber: number;
	onChange: (questionId: string, answer: string) => void;
}

const MultipleChoice: FC<MultipleChoiceProps> = ({
	question,
	questionNumber,
	onChange,
}) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	const handleOptionChange = (option: string) => {
		const newSelectedOption = selectedOption === option ? null : option;
		setSelectedOption(newSelectedOption);
		onChange(question.id, newSelectedOption || "");
	};

	return (
		<div className="p-4 my-2">
			<p className="mb-4 text-base font-medium">
				<span className="font-bold mr-2">{`Câu ${questionNumber}:`}</span>
				{question.content}
			</p>
			<div className="space-y-3">
				{question.options.map((option, index) => {
					const isSelected = selectedOption === option;
					const choiceLetter = String.fromCharCode(65 + index); // A, B, C, D

					return (
						<div
							key={index}
							onClick={() => handleOptionChange(option)}
							className="flex items-center space-x-4 cursor-pointer group"
						>
							<div
								className={clsx(
									"flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 transition-colors duration-200 flex-shrink-0",
									{
										"bg-orange-500 border-orange-500 text-white": isSelected,
										"bg-white group-hover:bg-gray-100": !isSelected,
									},
								)}
							>
								<span className="text-base font-semibold">{choiceLetter}</span>
							</div>
							<div
								className={clsx(
									"px-4 py-2 border rounded-md transition-colors duration-200 flex-1",
									{
										"border-orange-500 bg-orange-50": isSelected,
										"border-gray-300 group-hover:border-gray-400":
											!isSelected,
									},
								)}
							>
								<span className="text-base text-gray-800">{option}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default MultipleChoice; 