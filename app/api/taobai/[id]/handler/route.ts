import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCookie } from "@/utils/cookie";
const sql = neon(process.env.DATABASE_URL!);

export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const data = await _req.json();

		// Get session from cookie header
		const session = await getCookie("session");

		if (!session) {
			return NextResponse.json(
				{
					status: false,
					message: "User not authenticated",
				},
				{ status: 401 },
			);
		}

		// Sanitize table name to prevent SQL injection
		const sanitizedTableName = session.replace(/[^a-zA-Z0-9_]/g, "_");
		const fullTableName = `"User Infomation"."${sanitizedTableName}"`;

		// Create table with proper SQL syntax
		const createTableQuery = `
			CREATE TABLE IF NOT EXISTS ${fullTableName} (
				id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
				assignment_id text,
				name text,
				task text,
				work text,
				PRIMARY KEY (id)
			)
		`;
		await sql(createTableQuery);

		// Wait for table to be created and verify it exists
		let tableExists = false;
		let attempts = 0;
		const maxAttempts = 5;

		while (!tableExists && attempts < maxAttempts) {
			try {
				// Try to select from the table to verify it exists
				const verifyQuery = `SELECT 1 FROM ${fullTableName} LIMIT 1`;
				await sql(verifyQuery);
				tableExists = true;
			} catch {
				attempts++;
				// Wait for 500ms before trying again
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}

		if (!tableExists) {
			return NextResponse.json({
				status: false,
				message: "Failed to create table or table not accessible",
			});
		}

		// Insert data using parameterized query
		const insertQuery = `INSERT INTO ${fullTableName} (assignment_id,name) VALUES ($1,$2) RETURNING id`;
		const insertResult = await sql(insertQuery, [id, data.name]);

		if (!insertResult || insertResult.length === 0) {
			return NextResponse.json({
				status: false,
				message: "Lỗi khi lưu bài tập!",
			});
		}

		return NextResponse.json({
			status: true,
			message: id,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				status: false,
				message: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
