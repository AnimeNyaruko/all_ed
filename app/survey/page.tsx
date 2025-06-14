"use client";
import { useEffect } from "react";
import Header from "@/ui/Components/Header";
import Footer from "@/ui/Components/Footer";
import ProgressBar from "./components/ProgressBar";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Navigation from "./components/Navigation";
import ThankYou from "./components/ThankYou";
import { useSurveyForm } from "./hooks/useSurveyForm";
import { motion, AnimatePresence } from "framer-motion";

export default function SurveyPage() {
	const {
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
	} = useSurveyForm();

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			const firstErrorField = Object.keys(errors)[0];
			const errorElement = document.getElementById(
				`field-container-${firstErrorField}`
			);
			if (errorElement) {
				errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	}, [errors]);

	const renderStep = () => {
		const stepProps = { formData, setFormData, errors, setErrors };
		switch (currentStep) {
			case 1:
				return <Step1 {...stepProps} />;
			case 2:
				return <Step2 {...stepProps} />;
			case 3:
				return <Step3 {...stepProps} />;
			case 4:
				return <Step4 {...stepProps} />;
			default:
				return <Step1 {...stepProps} />;
		}
	};

	const variants = {
		enter: {
			x: 300,
			opacity: 0,
		},
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: {
			zIndex: 0,
			x: -300,
			opacity: 0,
		},
	};

	return (
		<>
			<Header />
			<main className="bg-gray-50 py-12 sm:py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<div className="bg-white p-8 sm:p-10 rounded-lg shadow-md overflow-hidden">
						{isSubmitted ? (
							<ThankYou />
						) : (
							<>
								<ProgressBar
									currentStep={currentStep}
									totalSteps={TOTAL_STEPS}
								/>
								<AnimatePresence mode="wait">
									<motion.div
										key={currentStep}
										variants={variants}
										initial="enter"
										animate="center"
										exit="exit"
										transition={{
											x: { type: "spring", stiffness: 300, damping: 30 },
											opacity: { duration: 0.2 },
										}}
										className="mt-8"
									>
										{renderStep()}
									</motion.div>
								</AnimatePresence>
								
								{submitError && (
									<div className="mt-4 text-center text-sm text-red-600">
										{submitError}
									</div>
								)}

								<Navigation
									currentStep={currentStep}
									totalSteps={TOTAL_STEPS}
									handleNext={handleNext}
									handlePrev={handlePrev}
									handleSubmit={handleSubmit}
									isSubmitting={isSubmitting}
								/>
							</>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
