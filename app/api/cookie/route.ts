import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { name, data } = await req.json();

	const cookieStore = await cookies();
	const cookieSession = cookieStore.get("session")?.value;

	if (!cookieSession) {
		cookieStore.set(name, data, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60, // 30 days
		});
		return NextResponse.redirect(
			new URL(process.env.NEXTAUTH_URL_DEV!, req.url),
		);
	}
	return NextResponse.json(false);
}
