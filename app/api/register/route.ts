"use server";

import bcrypt from "bcrypt";
import sql from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const data = await req.formData();
	const email = data.get("email")!.toString();
	const username = data.get("username")!.toString();
	const password = await bcrypt.hash(data.get("password")!.toString(), 10);

	const result = (
		await sql`SELECT "Password" from "User Infomation"."Infomation" WHERE "Email" = ${email} LIMIT 1`
	)[0].Password;
	if (result === "") {
		await sql`UPDATE "User Infomation"."Infomation" SET "Password" = ${password} WHERE "Email" = ${email}`;
	} else if (result) {
		return NextResponse.json("Tài khoản đã tồn tại!");
	}
	await sql`INSERT INTO "User Infomation"."Infomation" ("Name", "Username", "Password", "Email") VALUES (${email},${username},${password},${email})`;
	return NextResponse.json("");
}
