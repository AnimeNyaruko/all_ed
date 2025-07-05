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

const Step1 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
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
					Phần A: Thông tin chung
				</h3>
			</div>
			{/* Họ và tên */}
			<div id="field-container-fullName">
				<label
					htmlFor="fullName"
					className="text-base font-semibold text-gray-700 mb-1 block"
				>
					Họ và tên của bạn <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					name="Họ và Tên"
					id="fullName"
					value={formData["Họ và Tên"] || ""}
					onChange={handleChange}
					className={`px-3 py-2 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none ${
						errors["Họ và Tên"] ? "border-red-500" : "border-gray-300"
					}`}
					required
				/>
				{errors["Họ và Tên"] && (
					<p className="mt-1 text-xs text-red-600">{errors["Họ và Tên"]}</p>
				)}
			</div>

			{/* Trường */}
			<div id="field-container-school">
				<label
					htmlFor="school"
					className="text-base font-semibold text-gray-700 mb-1 block"
				>
					Bạn đến từ trường nào <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					name="Trường"
					id="school"
					value={formData["Trường"] || ""}
					onChange={handleChange}
					className={`px-3 py-2 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none ${
						errors["Trường"] ? "border-red-500" : "border-gray-300"
					}`}
					required
				/>
				{errors["Trường"] && (
					<p className="mt-1 text-xs text-red-600">{errors["Trường"]}</p>
				)}
			</div>

			{/* Vai trò */}
			<div id="field-container-role">
				<label className="text-base font-semibold text-gray-700 block">
					Vai trò của bạn là gì? <span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{ value: "Học sinh", label: "Học sinh" },
						{ value: "Giáo viên", label: "Giáo viên" },
						{ value: "Khác", label: "Khác" },
					].map(({ value, label }) => (
						<label
							key={value}
							className="p-2 -ml-2 rounded-md hover:bg-gray-100 flex cursor-pointer items-center transition-colors"
						>
							<input
								id={`role-${value}`}
								name="Vai trò"
								type="radio"
								value={value}
								checked={formData["Vai trò"] === value}
								onChange={() => handleRadioChange("Vai trò", value)}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 text-base text-gray-700 block">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors["Vai trò"] && (
					<p className="mt-1 text-xs text-red-600">{errors["Vai trò"]}</p>
				)}
				{formData["Vai trò"] === "Khác" && (
					<div className="mt-2" id="field-container-otherRole">
						<label htmlFor="otherRole" className="sr-only">
							Vui lòng ghi rõ
						</label>
						<input
							type="text"
							name="Vai trò khác"
							id="otherRole"
							value={formData["Vai trò khác"] || ""}
							onChange={handleChange}
							placeholder="Vui lòng ghi rõ vai trò của bạn"
							className={`mt-1 px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none ${
								errors["Vai trò khác"] ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{errors["Vai trò khác"] && (
							<p className="mt-1 text-xs text-red-600">
								{errors["Vai trò khác"]}
							</p>
						)}
					</div>
				)}
			</div>

			{/* Câu hỏi cho Học sinh */}
			{formData["Vai trò"] === "Học sinh" && (
				<div id="field-container-grade">
					<label className="text-base font-semibold text-gray-700 block">
						Nếu là học sinh, bạn đang học khối lớp nào?{" "}
						<span className="text-red-500">*</span>
					</label>
					<div className="mt-2 space-y-1">
						{[
							{ value: "Tiểu học", label: "Tiểu học" },
							{ value: "THCS", label: "THCS" },
							{ value: "Lớp 10", label: "Lớp 10" },
							{ value: "Lớp 11", label: "Lớp 11" },
							{ value: "Lớp 12", label: "Lớp 12" },
							{ value: "Đại học", label: "Đại học" },
							{ value: "Khác", label: "Khác" },
						].map(({ value, label }) => (
							<label
								key={value}
								className="p-2 -ml-2 rounded-md hover:bg-gray-100 flex cursor-pointer items-center transition-colors"
							>
								<input
									id={`grade-${value}`}
									name="Khối lớp"
									type="radio"
									value={value}
									checked={formData["Khối lớp"] === value}
									onChange={() => handleRadioChange("Khối lớp", value)}
									className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
								/>
								<span className="ml-3 text-base text-gray-700 block">
									{label}
								</span>
							</label>
						))}
						{errors["Khối lớp"] && (
							<p className="mt-1 text-xs text-red-600">{errors["Khối lớp"]}</p>
						)}
						{formData["Khối lớp"] === "Khác" && (
							<div className="mt-2" id="field-container-otherGrade">
								<label htmlFor="otherGrade" className="sr-only">
									Vui lòng ghi rõ
								</label>
								<input
									type="text"
									name="Khối lớp khác"
									id="otherGrade"
									value={formData["Khối lớp khác"] || ""}
									onChange={handleChange}
									placeholder="Vui lòng ghi rõ khối lớp"
									className={`mt-1 px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none ${
										errors["Khối lớp khác"]
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								{errors["Khối lớp khác"] && (
									<p className="mt-1 text-xs text-red-600">
										{errors["Khối lớp khác"]}
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Câu hỏi cho Giáo viên */}
			{formData["Vai trò"] === "Giáo viên" && (
				<div id="field-container-subjectAndExperience">
					<label
						htmlFor="subjectAndExperience"
						className="text-base font-semibold text-gray-700 block"
					>
						Nếu là giáo viên, môn học bạn đang giảng dạy là gì? Số năm kinh
						nghiệm? (Không bắt buộc)
					</label>
					<textarea
						name="Môn học và kinh nghiệm"
						id="subjectAndExperience"
						rows={3}
						value={formData["Môn học và kinh nghiệm"] || ""}
						onChange={handleChange}
						className="mt-1 px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base block w-full border focus:outline-none"
					/>
				</div>
			)}

			{/* Thời gian sử dụng */}
			<div id="field-container-usageDuration">
				<label className="text-base font-semibold text-gray-700 block">
					Bạn đã sử dụng website The AllEd trong bao lâu?{" "}
					<span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{
							value: "Mới sử dụng (Dưới 1 tuần)",
							label: "Mới sử dụng (Dưới 1 tuần)",
						},
						{ value: "1-4 tuần", label: "1-4 tuần" },
						{ value: "1-3 tháng", label: "1-3 tháng" },
						{ value: "Trên 3 tháng", label: "Trên 3 tháng" },
					].map(({ value, label }) => (
						<label
							key={value}
							className="p-2 -ml-2 rounded-md hover:bg-gray-100 flex cursor-pointer items-center transition-colors"
						>
							<input
								id={`usageDuration-${value}`}
								name="Thời gian sử dụng"
								type="radio"
								value={value}
								checked={formData["Thời gian sử dụng"] === value}
								onChange={() => handleRadioChange("Thời gian sử dụng", value)}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 text-base text-gray-700 block">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors["Thời gian sử dụng"] && (
					<p className="mt-1 text-xs text-red-600">
						{errors["Thời gian sử dụng"]}
					</p>
				)}
			</div>

			{/* Tần suất sử dụng */}
			<div id="field-container-usageFrequency">
				<label className="text-base font-semibold text-gray-700 block">
					Tần suất bạn sử dụng website The AllEd để học tập/tạo bài tập?{" "}
					<span className="text-red-500">*</span>
				</label>
				<div className="mt-2 space-y-1">
					{[
						{ value: "Hàng ngày", label: "Hàng ngày" },
						{ value: "Vài lần một tuần", label: "Vài lần một tuần" },
						{ value: "Một lần một tuần", label: "Một lần một tuần" },
						{ value: "Hiếm khi", label: "Hiếm khi" },
					].map(({ value, label }) => (
						<label
							key={value}
							className="p-2 -ml-2 rounded-md hover:bg-gray-100 flex cursor-pointer items-center transition-colors"
						>
							<input
								id={`usageFrequency-${value}`}
								name="Tần suất sử dụng"
								type="radio"
								value={value}
								checked={formData["Tần suất sử dụng"] === value}
								onChange={() => handleRadioChange("Tần suất sử dụng", value)}
								className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
							/>
							<span className="ml-3 text-base text-gray-700 block">
								{label}
							</span>
						</label>
					))}
				</div>
				{errors["Tần suất sử dụng"] && (
					<p className="mt-1 text-xs text-red-600">
						{errors["Tần suất sử dụng"]}
					</p>
				)}
			</div>
		</div>
	);
};

export default Step1;
