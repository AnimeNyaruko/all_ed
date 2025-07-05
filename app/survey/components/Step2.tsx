"use client";

import { SurveyFormData, Rating } from "@/types/survey";
import React from "react";
import { effectivenessQuestions as questions } from "../data/questions";

interface StepProps {
	formData: Partial<SurveyFormData>;
	setFormData: React.Dispatch<React.SetStateAction<Partial<SurveyFormData>>>;
	errors: Partial<Record<keyof SurveyFormData, string>>;
	setErrors: React.Dispatch<
		React.SetStateAction<Partial<Record<keyof SurveyFormData, string>>>
	>;
}

const ratingLabels = [
	{ value: 5, label: "5 - Hoàn toàn đồng ý" },
	{ value: 4, label: "4 - Đồng ý" },
	{ value: 3, label: "3 - Bình thường" },
	{ value: 2, label: "2 - Không đồng ý" },
	{ value: 1, label: "1 - Hoàn toàn không đồng ý" },
];

const RatingQuestion: React.FC<{
	question: { id: keyof SurveyFormData; text: string };
	value: Rating | undefined;
	error: string | undefined;
	onChange: (id: keyof SurveyFormData, value: Rating) => void;
}> = ({ question, value, error, onChange }) => (
	<div
		className="py-4 border-gray-200 border-b"
		id={`field-container-${question.id}`}
	>
		<label className="text-base font-semibold text-gray-700 block">
			{question.text} <span className="text-red-500">*</span>
		</label>
		<div className="mt-2 space-y-1 flex flex-col">
			{ratingLabels.map((item) => (
				<label
					key={item.value}
					className="p-2 -ml-2 rounded-md hover:bg-gray-100 flex cursor-pointer items-center transition-colors"
				>
					<input
						id={`${question.id}-${item.value}`}
						name={question.id}
						type="radio"
						value={item.value}
						checked={value === item.value}
						onChange={() => onChange(question.id, item.value as Rating)}
						className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
					/>
					<span className="ml-2 text-base text-gray-700 block">
						{item.label}
					</span>
				</label>
			))}
		</div>
		{error && <p className="mt-1 text-xs text-red-600">{error}</p>}
	</div>
);

const Step2 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleRatingChange = (name: keyof SurveyFormData, value: Rating) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};
	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900">
					Phần B: Đánh giá hiệu quả của việc học tập thông qua các bài tập liên
					môn trên website
				</h3>
				<p className="mt-1 text-base text-gray-600">
					<strong>Hướng dẫn:</strong> Vui lòng cho biết mức độ đồng ý của bạn
					với các phát biểu sau đây liên quan đến việc sử dụng các bài tập liên
					môn trên website The AllEd.
				</p>
			</div>

			<div className="space-y-2">
				{questions.map((q, index) => (
					<RatingQuestion
						key={index}
						question={{ ...q, text: `${index + 1}. ${q.text}` }}
						value={formData[q.id] as Rating | undefined}
						error={errors[q.id]}
						onChange={handleRatingChange}
					/>
				))}
			</div>

			<div className="pt-4" id="field-container-biggestBenefit_q9">
				<label
					htmlFor="biggestBenefit_q9"
					className="text-base font-semibold text-gray-700 block"
				>
					9. Câu hỏi mở: Theo bạn, lợi ích lớn nhất của việc học tập qua các bài
					tập liên môn trên website này là gì?
				</label>
				<textarea
					id="biggestBenefit_q9"
					name="Lợi ích lớn nhất"
					rows={4}
					value={formData["Lợi ích lớn nhất"] || ""}
					onChange={handleTextChange}
					className="mt-1 px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none"
				/>
			</div>

			<div id="field-container-learningDifficulties_q10">
				<label
					htmlFor="learningDifficulties_q10"
					className="text-base font-semibold text-gray-700 block"
				>
					10. Câu hỏi mở: Bạn có gặp khó khăn gì khi học hoặc tạo các bài tập
					liên môn trên website không? Nếu có, vui lòng chia sẻ.
				</label>
				<textarea
					id="learningDifficulties_q10"
					name="Khó khăn khi học"
					rows={4}
					value={formData["Khó khăn khi học"] || ""}
					onChange={handleTextChange}
					className="mt-1 px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none"
				/>
			</div>
		</div>
	);
};

export default Step2;
