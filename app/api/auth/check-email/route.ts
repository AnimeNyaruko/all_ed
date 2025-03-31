import sql from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { email } = await req.json();

	try {
		const result = await sql`
            SELECT "Name", "Email" 
            FROM "User Infomation"."Infomation" 
            WHERE "Email" = ${email} 
            LIMIT 1
        `;

		if (result.length > 0) {
			return NextResponse.json({
				exists: true,
				username: result[0].Name,
				email: result[0].Email,
			});
		}

		return NextResponse.json({ exists: false });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json({ exists: false });
	}
}
