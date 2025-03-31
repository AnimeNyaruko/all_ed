"use server";

import bcrypt from "bcrypt";
import sql from "@/utils/database";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const data = await req.formData();
	const email = data.get("email")!.toString();
	const password = data.get("password")!.toString();

	try {
		const dataPassword = (
			await sql`SELECT "Password" FROM "User Infomation"."Infomation" WHERE "Email" = ${email}`
		)[0].Password;

		const result = await bcrypt.compare(password, dataPassword);
		if (result) {
			return NextResponse.json("");
		} else return NextResponse.json("Sai mật khẩu");
	} catch (err) {
		return NextResponse.json("Tài khoản chưa được đăng ký");
	}
}
