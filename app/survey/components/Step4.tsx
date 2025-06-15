"use client";

import { SurveyFormData } from "@/types/survey";
import React from "react";

interface StepProps {
  formData: Partial<SurveyFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<SurveyFormData>>>;
  errors: Partial<Record<keyof SurveyFormData, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof SurveyFormData, string>>>>;
}

const Step4 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof SurveyFormData]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof SurveyFormData];
                return newErrors;
            });
        }
	};

	const handleRadioChange = (name: keyof SurveyFormData, value: string) => {
		setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
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
					className="block text-base font-semibold text-gray-700"
				>
					Bạn có muốn đề xuất tính năng mới nào cho The AllEd không?
				</label>
				<textarea
					name="newFeatureSuggestion"
					id="newFeatureSuggestion"
					rows={4}
					value={formData.newFeatureSuggestion || ""}
					onChange={handleChange}
					className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
				/>
			</div>

			{/* Khả năng giới thiệu */}
			<div id="field-container-recommendationLikelihood">
				<label className="block text-base font-semibold text-gray-700">
					Bạn có sẵn lòng giới thiệu The AllEd cho bạn bè/đồng nghiệp không?{" "}
					<span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{ value: "definitely-not", label: "Chắc chắn không" },
						{ value: "probably-not", label: "Có lẽ không" },
						{ value: "maybe", label: "Có thể" },
						{ value: "probably-yes", label: "Có lẽ có" },
						{ value: "definitely-yes", label: "Chắc chắn có" },
					].map(({ value, label }) => (
						<label key={value} className="flex items-center p-2 -ml-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
							<input
								id={`recommendationLikelihood-${value}`}
								name="recommendationLikelihood"
								type="radio"
								value={value}
								checked={formData.recommendationLikelihood === value}
								onChange={() =>
									handleRadioChange("recommendationLikelihood", value)
								}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 block text-base text-gray-700">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors.recommendationLikelihood && (
					<p className="mt-1 text-xs text-red-600">
						{errors.recommendationLikelihood}
					</p>
				)}
			</div>

			{/* Ý kiến khác */}
			<div id="field-container-otherFeedback">
				<label
					htmlFor="otherFeedback"
					className="block text-base font-semibold text-gray-700"
				>
					Bạn có bất kỳ ý kiến đóng góp nào khác không?
				</label>
				<textarea
					name="otherFeedback"
					id="otherFeedback"
					rows={4}
					value={formData.otherFeedback || ""}
					onChange={handleChange}
					className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
				/>
			</div>
		</div>
	);
};

export default Step4; 