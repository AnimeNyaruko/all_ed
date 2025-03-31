import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const cookie = req.cookies.get("session");

	// Allow access to login page only if not logged in
	if (path === "/dangnhap") {
		if (cookie) {
			return NextResponse.redirect(new URL("http://localhost:3000", req.url));
		}
		return NextResponse.next();
	}

	// Require authentication for other pages
	if (!cookie && path !== "/") {
		return NextResponse.redirect(new URL("/dangnhap", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
