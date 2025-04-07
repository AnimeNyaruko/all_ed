import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;

	// Verify the session token
	const session = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// Allow access to login page only if not logged in
	if (path === "/dangnhap") {
		if (session) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next();
	}

	// Require authentication for other pages
	if (!session && path !== "/") {
		return NextResponse.redirect(new URL(`/dangnhap`, req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
