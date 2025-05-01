"use client";

import { submitAssignment } from "../(handler)/handler";
import { useState, useEffect } from "react";

interface DataItem {
	name: string;
	assignment_id: string;
}

interface SelectionProps {
	data: DataItem[];
}

export default function Selection({ data }: SelectionProps) {
	const [_, setSelectedId] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isTextSelected, setIsTextSelected] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Set mounted state
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Monitor text selection
	useEffect(() => {
		if (!isMounted) return;

		const checkSelection = () => {
			const selection = window.getSelection();
			setIsTextSelected(selection !== null && selection.toString().length > 0);
		};

		document.addEventListener("selectionchange", checkSelection);
		document.addEventListener("mouseup", checkSelection);

		return () => {
			document.removeEventListener("selectionchange", checkSelection);
			document.removeEventListener("mouseup", checkSelection);
		};
	}, [isMounted]);

	const handleClick = async (assignmentId: string) => {
		if (!isMounted) return;

		// If text is selected, don't submit
		if (isTextSelected) {
			return;
		}

		if (isSubmitting) return;
		setSelectedId(assignmentId);

		// Create and submit form data directly
		const formData = new FormData();
		formData.append("assignment", assignmentId);

		setIsSubmitting(true);
		setError(null);

		try {
			const response = await submitAssignment(formData);
			if (response.success) {
				await new Promise((resolve) => setTimeout(resolve, 100));
				if (typeof window !== "undefined") {
					window.location.href = "/lambai";
				}
			} else {
				setError(response.error || "Failed to submit assignment");
				setIsSubmitting(false);
			}
		} catch (_) {
			setError("An unexpected error occurred");
			setIsSubmitting(false);
		}
	};

	// Don't render anything until mounted to prevent hydration mismatch
	if (!isMounted) {
		return null;
	}

	return (
		<div className="relative min-h-screen">
			<div className="inset-0 bg-white absolute brightness-75"></div>
			<div className="p-4 md:p-8 relative flex min-h-screen items-center justify-center">
				<div className="max-w-4xl w-full">
					{error && (
						<div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
							{error}
						</div>
					)}
					<div className="gap-4 grid grid-cols-1">
						{data.map((item, index) => (
							<div
								key={index}
								onClick={() => handleClick(item.assignment_id)}
								className={`p-6 rounded-lg hover:bg-opacity-90 cursor-pointer text-left transition-all duration-200 ${
									index % 3 === 0
										? "bg-blue-600"
										: index % 3 === 1
											? "bg-green-600"
											: "bg-purple-600"
								} text-white flex min-h-[100px] w-full flex-col justify-center`}
							>
								{item.name.split("\\n").map((line, lineIndex) => (
									<p key={lineIndex} className="text-lg">
										{line}
									</p>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
