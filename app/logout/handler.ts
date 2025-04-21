"use server";
import { cookies } from "next/headers";

export async function handler() {
	const cookie = await cookies();
	cookie.delete("session");
}
