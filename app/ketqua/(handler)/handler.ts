"use server";

import { deleteCookie, getCookie } from "@/utils/cookie";
import sanitizeUsername from "@/utils/sanitizeUsername";
import { redirect } from "next/navigation";
import sql from "@/utils/database";

export async function re_work() {
	const username = await getCookie("session");
	const assignment_id = await getCookie("assignment_id");
	if (!username) {
		redirect("/");
	}
	if (!assignment_id) {
		redirect("/taobai");
	}
	try {
		const query = `UPDATE "User Infomation"."${sanitizeUsername(username)}" SET "work" = NULL WHERE "assignment_id" = $1`;
		await sql(query, [assignment_id]);
	} catch (_e) {
		console.error(_e);
	}
	redirect("/lambai");
}

export async function re_create() {
	try {
		await deleteCookie("assignment_id");
	} catch (_e) {
		console.error(_e);
	}
	redirect("/taobai");
}
