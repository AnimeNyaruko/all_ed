"use server";

import { getCookie, setCookie } from "@/utils/cookie";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
import type {
	AnswerBlock,
	OriginalContent,
	FormattedOutput,
	QuestionStructure,
} from "../types";

async function fetchTask(assignmentId: string, sanitizedTableName: string) {
	const query = `SELECT "task","work" FROM "User Infomation"."${sanitizedTableName}" WHERE "assignment_id" = $1`;
	const data = await sql(query, [assignmentId]);
	return data;
}

export async function handler() {
	try {
		const assignmentId = await getCookie("assignment_id");
		const username = await getCookie("session");
		if (!assignmentId || !username) {
			return {
				data: null,
				status: "error",
				message: "No session found",
			};
		}
		const sanitizedTableName = sanitizeUsername(username);
		let task;
		do {
			task = await fetchTask(assignmentId, sanitizedTableName);
		} while (!task[0].task);
		return {
			data: task,
			status: "success",
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		return {
			data: null,
			status: "error",
			message: "No session found",
		};
	}
}

export async function submitAssignment(formData: FormData) {
	try {
		const assignmentId = formData.get("assignment");
		if (!assignmentId) {
			return { success: false, error: "No assignment ID provided" };
		}

		// Set the cookie and wait for it to be set
		await setCookie("assignment_id", assignmentId.toString());

		// Verify the cookie was set
		const verifyCookie = await getCookie("assignment_id");
		if (verifyCookie !== assignmentId.toString()) {
			return { success: false, error: "Failed to set cookie" };
		}

		return { success: true, assignmentId: assignmentId.toString() };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		return { success: false, error: "An error occurred" };
	}
}

export async function submitAnswers(
	originalContent: OriginalContent,
	answers: Record<string, AnswerBlock[]>,
) {
	try {
		const formattedOutput: FormattedOutput = {
			de_bai: originalContent?.de_bai || "", // Initialize with top-level de_bai
		};

		// --- REVISED PLAN START: Iterate over originalContent keys ---
		Object.keys(originalContent).forEach((key) => {
			// Skip the top-level 'de_bai' key itself, process others (like 'cau_a')
			if (key === "de_bai") {
				return;
			}

			// Get the data for the original sub-question (e.g., originalContent['cau_a'])
			const originalQuestionData = originalContent[key];
			let originalQuestionText = "";

			// Safely extract the 'de_bai' text for the sub-question
			if (
				typeof originalQuestionData === "object" &&
				originalQuestionData !== null &&
				"de_bai" in originalQuestionData
			) {
				// Assert type to access de_bai safely based on our structure
				originalQuestionText =
					(originalQuestionData as QuestionStructure).de_bai || "";
			} else {
				// Handle cases where a key exists but doesn't match QuestionStructure
				console.warn(
					`Expected structure with 'de_bai' not found for key "${key}" in originalContent.`,
				);
				// Decide if we should still include it with empty de_bai or skip
				// For now, let's skip keys that don't fit the expected pattern
				return;
			}

			// Look up the submitted answers for this specific key (e.g., answers['cau_a'])
			// Default to an empty array if no answer was submitted for this key
			const answerBlocks = answers?.[key] || []; // Use optional chaining for safety

			// Concatenate the content of the submitted answer blocks.
			// This will result in an empty string ("") if answerBlocks is empty.
			const submittedAnswerContent = answerBlocks
				.map((block) => block.content)
				.join("");

			// Add the entry to the formatted output, ensuring it exists even if bai_lam is empty
			formattedOutput[key] = {
				de_bai: originalQuestionText,
				bai_lam: submittedAnswerContent,
			};
		});
		// --- REVISED PLAN END ---

		const outputJsonString = JSON.stringify(formattedOutput, null, 2);
		console.log("Formatted output string (server-side):\n", outputJsonString);
		return { success: true };
	} catch (error) {
		console.error("Error processing answers (server-side):", error);
		return { success: false, error: "Server error during answer processing." };
	}
}
