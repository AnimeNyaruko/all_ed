"use server";

import { getCookie, setCookie } from "@/utils/cookie";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";

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
