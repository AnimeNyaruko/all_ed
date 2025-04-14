import { cookies } from "next/headers";

export async function setCookie(name: string, data: string) {
	const cookie = await cookies();
	cookie.set(name, data, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 30 * 24 * 60 * 60,
	});
}

export async function getCookie(name: string) {
	const cookie = await cookies();
	return cookie.get(name)?.value;
}

export async function deleteCookie(name: string) {
	const cookie = await cookies();
	cookie.delete(name);
}

export async function checkCookie(name: string) {
	const cookie = await cookies();
	return cookie.get(name) !== undefined;
}
