"use server";

import { getCookie, setCookie } from "@/utils/cookie";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
import type {
	AnswerBlock,
	// OriginalContent, // Removed as unused
	// FormattedOutput, // Removed as unused
	QuestionStructure,
} from "@/types";
import { redirect } from "next/navigation";

// Hàm helper để chuyển AnswerBlock[] thành chuỗi LaTeX
function answerBlocksToLatex(blocks: AnswerBlock[] | undefined): string {
	if (!blocks || blocks.length === 0) {
		return "";
	}
	// Duyệt qua các block và định dạng lại
	return blocks
		.map((block) => {
			if (block.type === "latex") {
				// Bao bọc nội dung LaTeX bằng dấu $
				return `$${block.content}$`;
			} else {
				// Giữ nguyên nội dung text
				return block.content;
			}
		})
		.join(""); // Nối các phần đã định dạng lại
}

// Hàm định dạng thời gian (giây sang HH:MM:SS)
function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

async function fetchTask(assignmentId: string, sanitizedTableName: string) {
	const query = `SELECT "task", "work" FROM "User Infomation"."${sanitizedTableName}" WHERE "assignment_id" = $1`;
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
		let taskData;
		do {
			taskData = await fetchTask(assignmentId, sanitizedTableName);
		} while (!taskData || !taskData[0] || !taskData[0].task);
		return {
			data: {
				task: taskData[0].task,
				work: taskData[0].work,
			},
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
	questions: Record<string, string>,
	answers: Record<string, AnswerBlock[]>,
) {
	const username = await getCookie("session");
	const assignmentID = await getCookie("assignment_id");

	if (!username) {
		redirect("/");
	}

	if (!assignmentID) {
		redirect("/lambai/selection");
	}
	try {
		const formattedTime = formatTime(timer);
		const cauHoiArray: string[] = [];
		const cauTraLoiLatexArray: string[] = [];

		// Lặp qua các câu hỏi
		Object.keys(questions).forEach((questionKey) => {
			const questionLatex = questions[questionKey];
			const answerBlocks = answers[questionKey] || [];
			const answerLatex = answerBlocksToLatex(answerBlocks);

			cauHoiArray.push(questionLatex);
			cauTraLoiLatexArray.push(answerLatex);
		});

		// Tạo payload JSON chỉ với LaTeX thuần
		const payload = {
			time: formattedTime,
			de_bai: deBai,
			cau_hoi: cauHoiArray,
			cau_tra_loi: cauTraLoiLatexArray,
			username,
			assignmentID,
		};

		// Gửi dữ liệu đến API dưới dạng JSON
		const apiUrl = `${process.env.NEXTAUTH_URL}/api/nopbai`;
		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json", // Chỉ định kiểu nội dung là JSON
			},
			body: JSON.stringify(payload), // Chuyển đổi payload thành chuỗi JSON
		});

		if (!response.ok) {
			console.error(
				"Nopbai API error:",
				response.status,
				await response.text(),
			);
		}
	} catch (error) {
		console.error("Error in submitAnswers:", error);
		return {
			success: false,
			error: error,
		};
	}
	redirect("/ketqua");
}

export async function saveWorkProgress(
	jsonData: string,
): Promise<{ success: boolean; error?: string }> {
	const username = await getCookie("session");
	const assignmentID = await getCookie("assignment_id");

	if (!username || !assignmentID) {
		console.error(
			"Save progress failed: Missing username or assignmentID cookie.",
		);
		return { success: false, error: "Missing session info" };
	}

	const sanitizedTableName = sanitizeUsername(username);

	try {
		const query = `UPDATE "User Infomation"."${sanitizedTableName}" SET "work" = $1 WHERE "assignment_id" = $2`;
		await sql(query, [jsonData, assignmentID]);
		return { success: true };
	} catch (error) {
		console.error("Error saving work progress:", error);
		return { success: false, error: "Database error saving progress" };
	}
}
