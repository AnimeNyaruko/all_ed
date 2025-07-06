"use client";
import { FC, useState, useMemo } from "react";
import clsx from "clsx";

interface ShortAnswerProps {
	question: {
		id: string;
		content: string;
	};
	questionNumber: number;
	onChange: (questionId: string, answer: string) => void;
}

const ANSWER_LENGTH = 4;
const GRID_ROWS = ["-", ",", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const ShortAnswer: FC<ShortAnswerProps> = ({
	question,
	questionNumber,
	onChange,
}) => {
	const [selections, setSelections] = useState<Record<number, string>>({});

	const handleSelection = (colIndex: number, char: string) => {
		const newSelections = { ...selections };

		if (newSelections[colIndex] === char) {
			delete newSelections[colIndex];
		} else {
			newSelections[colIndex] = char;
		}

		setSelections(newSelections);

		// Construct the final answer string and notify parent
		let answerString = "";
		for (let i = 0; i < ANSWER_LENGTH; i++) {
			answerString += newSelections[i] || " "; // Use space for empty slots
		}
		onChange(question.id, answerString.trim());
	};

	const answerDisplay = useMemo(() => {
		return Array.from({ length: ANSWER_LENGTH }, (_, i) => selections[i] || "");
	}, [selections]);

	return (
		<div className="p-4 my-2 flex items-start space-x-8">
			{/* Question Text (Left) */}
			<p className="flex-grow text-base font-medium">
				<span className="font-bold mr-2">{`Câu ${questionNumber}:`}</span>
				{question.content}
			</p>

			{/* Answer Grid (Right) */}
			<div className="flex-shrink-0">
				{/* Answer Display Boxes */}
				<div className="flex justify-center space-x-1 mb-4">
					{answerDisplay.map((char, index) => (
						<div
							key={index}
							className="flex items-center justify-center w-8 h-10 border-2 border-red-300 font-mono text-xl"
						>
							{char}
						</div>
					))}
				</div>

				{/* Grid Input */}
				<div className="flex space-x-3">
					{/* Row Labels */}
					<div className="flex flex-col items-center justify-around font-semibold text-gray-600">
						{GRID_ROWS.map((rowLabel) => (
							<div key={rowLabel} className="h-7 flex items-center">
								{rowLabel}
							</div>
						))}
					</div>

					{/* Bubble Columns */}
					<div className="flex-grow grid grid-cols-4 gap-x-2">
						{Array.from({ length: ANSWER_LENGTH }, (_, colIndex) => (
							<div
								key={colIndex}
								className="flex flex-col items-center justify-around"
							>
								{GRID_ROWS.map((char) => {
									let isDisabled = false;
									// Rule for '-' sign: only in the first column
									if (char === "-" && colIndex !== 0) {
										isDisabled = true;
									}
									// Rule for ',' (decimal point): not in first or last column
									if (char === "," && (colIndex === 0 || colIndex === ANSWER_LENGTH - 1)) {
										isDisabled = true;
									}

									if (isDisabled) {
										return (
											<div
												key={char}
												className="w-6 h-6 my-[2px]"
											></div>
										);
									}

									return (
										<div
											key={char}
											onClick={() => handleSelection(colIndex, char)}
											className={clsx(
												"w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 my-[2px]",
												selections[colIndex] === char
													? "border-orange-500 bg-orange-500"
													: "border-red-300 hover:border-orange-400",
											)}
										></div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShortAnswer; 