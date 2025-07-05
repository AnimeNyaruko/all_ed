"use client";

import { SurveyFormData, UXRating } from "@/types/survey";
import React from "react";
import { uxQuestions } from "../data/questions";

interface StepProps {
	formData: Partial<SurveyFormData>;
	setFormData: React.Dispatch<React.SetStateAction<Partial<SurveyFormData>>>;
	errors: Partial<Record<keyof SurveyFormData, string>>;
	setErrors: React.Dispatch<
		React.SetStateAction<Partial<Record<keyof SurveyFormData, string>>>
	>;
}

const UXQuestion: React.FC<{
	question: { id: keyof SurveyFormData; left: string; right: string };
	value: UXRating | undefined;
	error: string | undefined;
	onChange: (id: keyof SurveyFormData, value: UXRating) => void;
}> = ({ question, value, error, onChange }) => (
	<>
		<tr id={`field-container-${question.id}`}>
			<td className="pr-4 py-2 text-base text-gray-700 w-1/4 text-right">
				{question.left}
			</td>
			{[1, 2, 3, 4, 5, 6, 7].map((num) => (
				<td key={num} className="py-2 text-center">
					<input
						type="radio"
						name={question.id}
						value={num}
						checked={value === num}
						onChange={() => onChange(question.id, num as UXRating)}
						className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
					/>
				</td>
			))}
			<td className="pl-4 py-2 text-base text-gray-700 w-1/4 text-left">
				{question.right}
			</td>
		</tr>
		{error && (
			<tr>
				<td colSpan={9} className="pt-0 pb-2 text-xs text-red-600 text-center">
					{error}
				</td>
			</tr>
		)}
	</>
);

const Step3 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleRatingChange = (name: keyof SurveyFormData, value: UXRating) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900">
					Phần C: Đánh giá trải nghiệm người dùng trên website (UX)
				</h3>
				<p className="mt-1 text-base text-gray-600">
					<strong>Hướng dẫn:</strong> Vui lòng cho biết mức độ đồng ý của bạn
					với các phát biểu sau đây liên quan đến việc sử dụng website The
					AllEd. (Chọn theo thang đo). <span className="text-red-500">*</span>
				</p>
			</div>

			<div className="overflow-x-auto">
				<table
					className="min-w-full border-separate"
					style={{ borderSpacing: "0 0.5rem" }}
				>
					<thead>
						<tr>
							<th className="w-1/4"></th>
							{[1, 2, 3, 4, 5, 6, 7].map((num) => (
								<th
									key={num}
									className="font-medium text-gray-600 w-[4ch] text-center"
								>
									{num}
								</th>
							))}
							<th className="w-1/4"></th>
						</tr>
					</thead>
					<tbody>
						{uxQuestions.map((q, index) => (
							<UXQuestion
								key={index}
								question={q}
								value={formData[q.id] as UXRating | undefined}
								error={errors[q.id]}
								onChange={handleRatingChange}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Step3;
