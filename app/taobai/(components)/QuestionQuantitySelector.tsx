"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

// Interface này đảm bảo type-safety cho component
interface QuestionQuantities {
	multipleChoice: number;
	trueFalse: number;
	shortAnswer: number;
	essay: number;
}

interface Props {
	quantities: QuestionQuantities;
	onCheckboxChange: (type: keyof QuestionQuantities, isChecked: boolean) => void;
	onQuantityChange: (type: keyof QuestionQuantities, delta: number) => void;
	onQuantityInputChange: (type: keyof QuestionQuantities, value: string) => void;
	onQuantityInputBlur: (
		type: keyof QuestionQuantities,
		currentValue: string,
	) => void;
}

const QuestionQuantitySelector = ({
	quantities,
	onCheckboxChange,
	onQuantityChange,
	onQuantityInputChange,
	onQuantityInputBlur,
}: Props) => {
	return (
		<div className="my-5 p-4 bg-white rounded-lg border-blue-200 shadow-sm w-full border">
			<h3 className="text-lg font-semibold text-gray-800 mb-3">
				Loại và Số lượng câu hỏi
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{(
					[
						{ key: "multipleChoice", label: "Trắc nghiệm" },
						{ key: "trueFalse", label: "Đúng/Sai" },
						{ key: "shortAnswer", label: "Trả lời ngắn" },
						{ key: "essay", label: "Tự luận" },
					] as { key: keyof QuestionQuantities; label: string }[]
				).map(({ key, label }) => {
					const isSelected = quantities[key] > 0;
					return (
						<div
							key={key}
							onClick={() => onCheckboxChange(key, !isSelected)}
							className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
								isSelected
									? "bg-blue-50 border-blue-400 shadow-md"
									: "bg-gray-50 border-gray-200 hover:border-gray-300"
							}`}
						>
							<div className="flex items-center justify-between">
								<label
									htmlFor={key}
									className="font-semibold text-gray-800 select-none cursor-pointer"
								>
									{label}
								</label>
								<input
									type="checkbox"
									id={key}
									name={key}
									readOnly
									checked={isSelected}
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
								/>
							</div>
							{isSelected && (
								<div
									className="mt-3 flex items-center justify-center gap-2"
									onClick={(e) => e.stopPropagation()} // Prevent card from being deselected when clicking controls
								>
									<button
										type="button"
										onClick={() => onQuantityChange(key, -1)}
										className="w-8 h-8 flex items-center justify-center border rounded-md text-xl font-bold text-gray-600 bg-white hover:bg-gray-100"
									>
										-
									</button>
									<input
										type="number"
										min="1"
										max="5"
										value={quantities[key]}
										onChange={(e) =>
											onQuantityInputChange(key, e.target.value)
										}
										onBlur={(e) => onQuantityInputBlur(key, e.target.value)}
										className="w-16 text-center font-bold text-2xl text-blue-700 bg-transparent border-none focus:ring-0"
									/>
									<button
										type="button"
										onClick={() => onQuantityChange(key, 1)}
										className="w-8 h-8 flex items-center justify-center border rounded-md text-xl font-bold text-gray-600 bg-white hover:bg-gray-100"
									>
										+
									</button>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default React.memo(QuestionQuantitySelector); 