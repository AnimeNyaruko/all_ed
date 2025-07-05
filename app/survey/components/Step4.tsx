"use client";

import { SurveyFormData } from "@/types/survey";
import React from "react";

interface StepProps {
	formData: Partial<SurveyFormData>;
	setFormData: React.Dispatch<React.SetStateAction<Partial<SurveyFormData>>>;
	errors: Partial<Record<keyof SurveyFormData, string>>;
	setErrors: React.Dispatch<
		React.SetStateAction<Partial<Record<keyof SurveyFormData, string>>>
	>;
}

const Step4 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof SurveyFormData]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name as keyof SurveyFormData];
				return newErrors;
			});
		}
	};

	const handleRadioChange = (name: keyof SurveyFormData, value: string) => {
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
					Phần D: Góp ý và Đề xuất
				</h3>
			</div>
			{/* Đề xuất tính năng mới */}
			<div id="field-container-newFeatureSuggestion">
				<label
					htmlFor="newFeatureSuggestion"
					className="text-base font-semibold text-gray-700 block"
				>
					Bạn có muốn đề xuất tính năng mới nào cho The AllEd không?
				</label>
				<textarea
					name="Đề xuất tính năng mới"
					id="newFeatureSuggestion"
					rows={4}
					value={formData["Đề xuất tính năng mới"] || ""}
					onChange={handleChange}
					className="mt-1 px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none"
				/>
			</div>

			{/* Khả năng giới thiệu */}
			<div id="field-container-recommendationLikelihood">
				<label className="text-base font-semibold text-gray-700 block">
					Bạn có sẵn lòng giới thiệu The AllEd cho bạn bè/đồng nghiệp không?{" "}
					<span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{ value: "Chắc chắn không", label: "Chắc chắn không" },
						{ value: "Có lẽ không", label: "Có lẽ không" },
						{ value: "Có thể", label: "Có thể" },
						{ value: "Có lẽ có", label: "Có lẽ có" },
						{ value: "Chắc chắn có", label: "Chắc chắn có" },
					].map(({ value, label }) => (
						<label
							key={value}
							className="p-2 -ml-2 rounded-md hover:bg-gray-100 flex cursor-pointer items-center transition-colors"
						>
							<input
								id={`recommendationLikelihood-${value}`}
								name="Khả năng giới thiệu"
								type="radio"
								value={value}
								checked={formData["Khả năng giới thiệu"] === value}
								onChange={() => handleRadioChange("Khả năng giới thiệu", value)}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 text-base text-gray-700 block">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors["Khả năng giới thiệu"] && (
					<p className="mt-1 text-xs text-red-600">
						{errors["Khả năng giới thiệu"]}
					</p>
				)}
			</div>

			{/* Ý kiến khác */}
			<div id="field-container-otherFeedback">
				<label
					htmlFor="otherFeedback"
					className="text-base font-semibold text-gray-700 block"
				>
					Bạn có bất kỳ ý kiến đóng góp nào khác không?
				</label>
				<textarea
					name="Góp ý khác"
					id="otherFeedback"
					rows={4}
					value={formData["Góp ý khác"] || ""}
					onChange={handleChange}
					className="mt-1 px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none"
				/>
			</div>
		</div>
	);
};

export default Step4;
