"use client";

import { useState } from 'react';
import { SurveyFormData } from '@/types/survey';
import { validateStep1, validateStep2, validateStep3, validateStep4 } from '../utils/validation';

const TOTAL_STEPS = 4;

export const useSurveyForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<Partial<SurveyFormData>>({
		// Step 1
		fullName: "",
		school: "",
		role: "",
		usageDuration: "",
		usageFrequency: "",
		// Step 2
		effectiveness_q1: "",
		effectiveness_q2: "",
		effectiveness_q3: "",
		effectiveness_q4: "",
		effectiveness_q5: "",
		effectiveness_q6: "",
		effectiveness_q7: "",
		effectiveness_q8: "",
		biggestBenefit_q9: "",
		learningDifficulties_q10: "",
		// Step 3
		ux_q1: '', ux_q2: '', ux_q3: '', ux_q4: '', ux_q5: '',
		ux_q6: '', ux_q7: '', ux_q8: '', ux_q9: '', ux_q10: '',
		ux_q11: '', ux_q12: '', ux_q13: '', ux_q14: '', ux_q15: '',
		ux_q16: '', ux_q17: '', ux_q18: '', ux_q19: '', ux_q20: '',
		ux_q21: '', ux_q22: '', ux_q23: '', ux_q24: '', ux_q25: '',
		ux_q26: '',
		// Step 4
		recommendationLikelihood: ""
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
				setCurrentStep(prev => prev + 1);
			}
		}
	};

	const handlePrev = () => {
		if (currentStep > 1) {
			setCurrentStep(prev => prev - 1);
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
				const response = await fetch('/api/survey', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
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
} 