import { NextResponse } from "next/server";

export async function GET() {
	const response = await fetch("http://localhost:8080", {
		method: "GET",
	});
	return NextResponse.json(await response.text());
}
