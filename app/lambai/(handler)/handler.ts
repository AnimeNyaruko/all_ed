"use server";

import { getCookie, setCookie } from "@/utils/cookie";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
import type {
	AnswerBlock,
	// OriginalContent, // Removed as unused
	// FormattedOutput, // Removed as unused
	QuestionStructure,
} from "../types";

// Hàm helper để chuyển AnswerBlock[] thành chuỗi LaTeX
function answerBlocksToLatex(blocks: AnswerBlock[] | undefined): string {
	if (!blocks || blocks.length === 0) {
		return "";
	}
	// Nối nội dung của các block lại
	return blocks.map((block) => block.content).join("");
}

// Hàm định dạng thời gian (giây sang HH:MM:SS)
function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

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
	} catch (_) {
		return { success: false, error: "An error occurred" };
	}
}

export async function submitAnswers(
	timer: number,
	deBai: string,
	questions: QuestionStructure,
	answers: Record<string, AnswerBlock[]>,
) {
	try {
		const formattedTime = formatTime(timer);
		const cauHoiData: Record<string, string> = {};

		// Lặp qua các câu hỏi để lấy câu hỏi và câu trả lời tương ứng
		Object.keys(questions).forEach((questionKey) => {
			// Explicitly cast questionKey to keyof QuestionStructure if needed,
			// but Object.keys ensures it's a valid key here.
			const questionLatex = questions[questionKey as keyof QuestionStructure]; // Nội dung câu hỏi (LaTeX)
			const answerBlocks = answers[questionKey]; // Mảng AnswerBlock[]
			const answerLatex = answerBlocksToLatex(answerBlocks); // Chuyển thành chuỗi LaTeX (có thể rỗng)

			cauHoiData[questionLatex] = answerLatex;
		});

		// Tạo FormData
		const formData = new FormData();
		formData.append("time", formattedTime);
		formData.append("de_bai", deBai);
		formData.append("cau_hoi", JSON.stringify(cauHoiData)); // Chuyển object thành chuỗi JSON

		// Gửi dữ liệu đến API
		const apiUrl = `${process.env.NEXTAUTH_URL}/api/nopbai`;
		const response = await fetch(apiUrl, {
			method: "POST",
			body: formData,
			// Headers không cần thiết cho FormData với fetch mặc định
		});

		if (!response.ok) {
			console.error(
				"Nopbai API error:",
				response.status,
				await response.text(),
			);
			return {
				success: false,
				error: `API request failed with status ${response.status}`,
			};
		}

		const result = await response.json();
		console.log("Nopbai API success:", result);
		return { success: true, data: result };
	} catch (error) {
		console.error("Error in submitAnswers:", error);
		return {
			success: false,
			error: "An unexpected error occurred during submission.",
		};
	}
}
