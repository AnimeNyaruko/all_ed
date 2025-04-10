import sql from "@/utils/database";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	const cookie = await cookies();
	const username = cookie.get("session")?.value;
	// Example of getting count from a table

	await sql`CREATE TABLE IF NOT EXISTS "User Infomation".${username} (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        username text NOT NULL UNIQUE,
            assignment_id text,
                PRIMARY KEY (id)
                )`;

	const result =
		await sql`INSERT INTO "User Infomation".${username} (username, assignment_id) VALUES (${username}, ${id})`;
	if (!result[0]) {
		return NextResponse.json({
			status: false,
			message: "Lỗi khi lưu bài tập!",
		});
	}
	return NextResponse.json({ status: true, message: id });
}
