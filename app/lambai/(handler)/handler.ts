"use server";

import { getCookie, setCookie } from "@/utils/cookie";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
import { redirect } from "next/navigation";
async function fetchTask(assignmentId: string, sanitizedTableName: string) {
	const query = `SELECT "task","work" FROM "User Infomation"."${sanitizedTableName}" WHERE "assignment_id" = $1`;
	const data = await sql(query, [assignmentId]);
	return data;
}

export async function handler() {
	const assignmentId = await getCookie("assignment_id");
	const username = await getCookie("session");
	if (!assignmentId || !username) {
		return {
			data: null,
			status: "error",
			message: "No session found",
		};
	}
	// Sanitize the table name to prevent SQL injection
	const sanitizedTableName = sanitizeUsername(username);
	const task = await fetchTask(assignmentId, sanitizedTableName);
	return {
		data: task,
		status: "success",
	};
}

export async function submitAssignment(formData: FormData) {
	const assignmentId = formData.get("assignment")!.toString();
	await setCookie("assignment_id", assignmentId);
	redirect("/lambai");
}
