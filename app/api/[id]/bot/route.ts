import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// import sql from "@/utils/database";

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const formData = await req.formData();
	const subject = formData.getAll("subject");
	const grade = formData.getAll("grade");
	const prompt = formData.getAll("prompt");

	const cookie = await cookies();
	cookie.set("TheAllEd_data_assignment", id, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 30,
	});

	return NextResponse.json({ subject, grade, prompt });
}
