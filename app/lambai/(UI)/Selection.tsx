"use client";

import { submitAssignment } from "../(handler)/handler";
import { useState } from "react";

interface DataItem {
	name: string;
	assignment_id: string;
}

interface SelectionProps {
	data: DataItem[];
}

export default function Selection({ data }: SelectionProps) {
	const [selectedId, setSelectedId] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		submitAssignment(formData);
	};

	const handleClick = (assignmentId: string) => {
		setSelectedId(assignmentId);
		const form = document.getElementById("assignmentForm") as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	};

	const handleTextClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div className="relative min-h-screen">
			<div className="inset-0 bg-white absolute brightness-75"></div>
			<div className="p-4 md:p-8 relative flex min-h-screen items-center justify-center">
				<div className="max-w-4xl w-full">
					<form id="assignmentForm" onSubmit={handleSubmit}>
						<input type="hidden" name="assignment" value={selectedId} />
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
									<div onClick={handleTextClick} className="cursor-default">
										{item.name.split("\\n").map((line, lineIndex) => (
											<p key={lineIndex} className="text-lg">
												{line}
											</p>
										))}
									</div>
								</div>
							))}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
