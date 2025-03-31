import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { data, option } = await req.json();

	const cookieStore = await cookies();
	const cookieSession = cookieStore.get("session")?.value;

	if (!cookieSession) {
		cookieStore.set("session", data, {
			...option,
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60, // 30 days
		});
		return NextResponse.redirect(new URL("http://localhost:3000", req.url));
	}
	return NextResponse.json(false);
}
