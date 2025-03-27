import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

function checkPath(path: string, arrayPath: Array<string>) {
	return arrayPath.includes(path);
}

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const cookie = (await cookies()).get("session")?.value;

	const publicRoute = ["/dangnhap", "/"];
	if (!checkPath(path, publicRoute) && !cookie) {
		return NextResponse.redirect(new URL("/dangnhap", req.nextUrl));
	}
	return;
}
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
