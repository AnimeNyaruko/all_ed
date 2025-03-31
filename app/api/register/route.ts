"use server";

import bcrypt from "bcrypt";
import sql from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const data = await req.formData();
	const email = data.get("email")!.toString();
	const username = data.get("username")!.toString();
	const password = await bcrypt.hash(data.get("password")!.toString(), 10);

	let result;

	try {
		result = (
			await sql`SELECT "Name" from "User Infomation"."Infomation" WHERE "Email" = ${email} LIMIT 1`
		)[0].Name;
		return NextResponse.json("Tài khoản đã tồn tại!");
	} catch (err) {
		result =
			await sql`INSERT INTO "User Infomation"."Infomation" ("Name", "Username", "Password", "Email") VALUES (${email},${username},${password},${email})`;
		return NextResponse.json("");
	}
}
