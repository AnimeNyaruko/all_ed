"use client";

import { useState } from "react";
import { SurveyFormData } from "@/types/survey";
import {
	validateStep1,
	validateStep2,
	validateStep3,
	validateStep4,
} from "../utils/validation";

const TOTAL_STEPS = 4;

export const useSurveyForm = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<Partial<SurveyFormData>>({
		// Step 1
		"Họ và Tên": "",
		Trường: "",
		"Vai trò": "",
		"Thời gian sử dụng": "",
		"Tần suất sử dụng": "",
		// Step 2
		"Hiệu quả câu 1": "",
		"Hiệu quả câu 2": "",
		"Hiệu quả câu 3": "",
		"Hiệu quả câu 4": "",
		"Hiệu quả câu 5": "",
		"Hiệu quả câu 6": "",
		"Hiệu quả câu 7": "",
		"Hiệu quả câu 8": "",
		"Lợi ích lớn nhất": "",
		"Khó khăn khi học": "",
		// Step 3
		"UX câu 1": "",
		"UX câu 2": "",
		"UX câu 3": "",
		"UX câu 4": "",
		"UX câu 5": "",
		"UX câu 6": "",
		"UX câu 7": "",
		"UX câu 8": "",
		"UX câu 9": "",
		"UX câu 10": "",
		"UX câu 11": "",
		"UX câu 12": "",
		"UX câu 13": "",
		"UX câu 14": "",
		"UX câu 15": "",
		"UX câu 16": "",
		"UX câu 17": "",
		"UX câu 18": "",
		"UX câu 19": "",
		"UX câu 20": "",
		"UX câu 21": "",
		"UX câu 22": "",
		"UX câu 23": "",
		"UX câu 24": "",
		"UX câu 25": "",
		"UX câu 26": "",
		// Step 4
		"Khả năng giới thiệu": "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof SurveyFormData, string>>
	>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleNext = () => {
		setErrors({});
		let validationErrors: Partial<Record<keyof SurveyFormData, string>> = {};
		if (currentStep === 1) {
			validationErrors = validateStep1(formData);
		} else if (currentStep === 2) {
			validationErrors = validateStep2(formData);
		} else if (currentStep === 3) {
			validationErrors = validateStep3(formData);
		}

		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			if (currentStep < TOTAL_STEPS) {
				setCurrentStep((prev) => prev + 1);
			}
		}
	};

	const handlePrev = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const handleSubmit = async () => {
		setErrors({});
		let validationErrors: Partial<Record<keyof SurveyFormData, string>> = {};
		if (currentStep === 4) {
			validationErrors = validateStep4(formData);
		}

		setErrors(validationErrors);

		if (Object.keys(validationErrors).length === 0) {
			setIsSubmitting(true);
			setSubmitError(null);
			try {
				const response = await fetch(`http://localhost:3000/survey`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (!response.ok) {
					throw new Error("Network response was not ok");
				} else {
					console.log(await response.json());
				}
				setIsSubmitted(true);
			} catch (error) {
				console.error("Submission error:", error);
				setSubmitError("Đã có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.");
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	return {
		currentStep,
		TOTAL_STEPS,
		formData,
		setFormData,
		errors,
		setErrors,
		isSubmitting,
		submitError,
		isSubmitted,
		handleNext,
		handlePrev,
		handleSubmit,
	};
};
