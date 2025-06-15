"use client";

import { SurveyFormData } from "@/types/survey";
import React from "react";

interface StepProps {
  formData: Partial<SurveyFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<SurveyFormData>>>;
  errors: Partial<Record<keyof SurveyFormData, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof SurveyFormData, string>>>>;
}

const Step1 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
					Phần A: Thông tin chung
				</h3>
			</div>
			{/* Họ và tên */}
			<div id="field-container-fullName">
				<label
					htmlFor="fullName"
					className="block text-base font-semibold text-gray-700 mb-1"
				>
					Họ và tên của bạn <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					name="fullName"
					id="fullName"
					value={formData.fullName || ""}
					onChange={handleChange}
					className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${
						errors.fullName ? "border-red-500" : "border-gray-300"
					}`}
					required
				/>
				{errors.fullName && (
					<p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
				)}
			</div>

			{/* Trường */}
			<div id="field-container-school">
				<label
					htmlFor="school"
					className="block text-base font-semibold text-gray-700 mb-1"
				>
					Bạn đến từ trường nào <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					name="school"
					id="school"
					value={formData.school || ""}
					onChange={handleChange}
					className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${
						errors.school ? "border-red-500" : "border-gray-300"
					}`}
					required
				/>
				{errors.school && (
					<p className="mt-1 text-xs text-red-600">{errors.school}</p>
				)}
			</div>

			{/* Vai trò */}
			<div id="field-container-role">
				<label className="block text-base font-semibold text-gray-700">
					Vai trò của bạn là gì? <span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{ value: "student", label: "Học sinh" },
						{ value: "teacher", label: "Giáo viên" },
						{ value: "other", label: "Khác" },
					].map(({ value, label }) => (
						<label key={value} className="flex items-center p-2 -ml-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
							<input
								id={`role-${value}`}
								name="role"
								type="radio"
								value={value}
								checked={formData.role === value}
								onChange={() => handleRadioChange("role", value)}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 block text-base text-gray-700">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors.role && (
					<p className="mt-1 text-xs text-red-600">{errors.role}</p>
				)}
				{formData.role === "other" && (
					<div className="mt-2" id="field-container-otherRole">
						<label htmlFor="otherRole" className="sr-only">
							Vui lòng ghi rõ
						</label>
						<input
							type="text"
							name="otherRole"
							id="otherRole"
							value={formData.otherRole || ""}
							onChange={handleChange}
							placeholder="Vui lòng ghi rõ vai trò của bạn"
							className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${
								errors.otherRole ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors.otherRole && (
							<p className="mt-1 text-xs text-red-600">{errors.otherRole}</p>
						)}
					</div>
				)}
			</div>

			{/* Câu hỏi cho Học sinh */}
			{formData.role === "student" && (
				<div id="field-container-grade">
					<label className="block text-base font-semibold text-gray-700">
						Nếu là học sinh, bạn đang học khối lớp nào? <span className="text-red-500">*</span>
					</label>
					<div className="mt-2 space-y-1">
						{[
							{ value: "elementary", label: "Tiểu học" },
							{ value: "middle", label: "THCS" },
							{ value: "10", label: "Lớp 10" },
							{ value: "11", label: "Lớp 11" },
							{ value: "12", label: "Lớp 12" },
							{ value: "university", label: "Đại học" },
							{ value: "other", label: "Khác" },
						].map(({ value, label }) => (
							<label key={value} className="flex items-center p-2 -ml-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
								<input
									id={`grade-${value}`}
									name="grade"
									type="radio"
									value={value}
									checked={formData.grade === value}
									onChange={() => handleRadioChange("grade", value)}
									className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
								/>
								<span className="ml-3 block text-base text-gray-700">
									{label}
								</span>
							</label>
						))}
						{errors.grade && (
							<p className="mt-1 text-xs text-red-600">{errors.grade}</p>
						)}
						{formData.grade === "other" && (
							<div className="mt-2" id="field-container-otherGrade">
								<label htmlFor="otherGrade" className="sr-only">
									Vui lòng ghi rõ
								</label>
								<input
									type="text"
									name="otherGrade"
									id="otherGrade"
									value={formData.otherGrade || ""}
									onChange={handleChange}
									placeholder="Vui lòng ghi rõ khối lớp"
									className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base ${
										errors.otherGrade ? "border-red-500" : "border-gray-300"
									}`}
								/>
								{errors.otherGrade && (
									<p className="mt-1 text-xs text-red-600">{errors.otherGrade}</p>
								)}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Câu hỏi cho Giáo viên */}
			{formData.role === "teacher" && (
				<div id="field-container-subjectAndExperience">
					<label
						htmlFor="subjectAndExperience"
						className="block text-base font-semibold text-gray-700"
					>
						Nếu là giáo viên, môn học bạn đang giảng dạy là gì? Số năm kinh
						nghiệm? (Không bắt buộc)
					</label>
					<textarea
						name="subjectAndExperience"
						id="subjectAndExperience"
						rows={3}
						value={formData.subjectAndExperience || ""}
						onChange={handleChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
					/>
				</div>
			)}

			{/* Thời gian sử dụng */}
			<div id="field-container-usageDuration">
				<label className="block text-base font-semibold text-gray-700">
					Bạn đã sử dụng website The AllEd trong bao lâu? <span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{ value: "new", label: "Mới sử dụng (Dưới 1 tuần)" },
						{ value: "1-4w", label: "1-4 tuần" },
						{ value: "1-3m", label: "1-3 tháng" },
						{ value: "over-3m", label: "Trên 3 tháng" },
					].map(({ value, label }) => (
						<label key={value} className="flex items-center p-2 -ml-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
							<input
								id={`usageDuration-${value}`}
								name="usageDuration"
								type="radio"
								value={value}
								checked={formData.usageDuration === value}
								onChange={() => handleRadioChange("usageDuration", value)}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 block text-base text-gray-700">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors.usageDuration && (
					<p className="mt-1 text-xs text-red-600">{errors.usageDuration}</p>
				)}
			</div>

			{/* Tần suất sử dụng */}
			<div id="field-container-usageFrequency">
				<label className="block text-base font-semibold text-gray-700">
					Tần suất bạn sử dụng website The AllEd để học tập/tạo bài tập? <span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{ value: "daily", label: "Hàng ngày" },
						{ value: "few-times-week", label: "Vài lần một tuần" },
						{ value: "once-week", label: "Một lần một tuần" },
						{ value: "rarely", label: "Hiếm khi" },
					].map(({ value, label }) => (
						<label key={value} className="flex items-center p-2 -ml-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
							<input
								id={`usageFrequency-${value}`}
								name="usageFrequency"
								type="radio"
								value={value}
								checked={formData.usageFrequency === value}
								onChange={() => handleRadioChange("usageFrequency", value)}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 block text-base text-gray-700">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors.usageFrequency && (
					<p className="mt-1 text-xs text-red-600">{errors.usageFrequency}</p>
				)}
			</div>
		</div>
	);
};

export default Step1; 