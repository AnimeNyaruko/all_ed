"use server";
import { SHA3 } from "sha3";
import { cookies } from "next/headers";

export async function handler(formData: FormData) {
	const prompt = formData.getAll("prompt");
	const _class = formData.getAll("class");
	const subject = formData.getAll("subject");
	const cookieStore = await cookies();
	const session = cookieStore.get("session")?.value;

	if (!session) {
		return "User not authenticated";
	}

	const promptString = prompt.reduce((prev, curr) => {
		prev = prev.toString();
		curr = curr.toString();
		return prev + curr;
	}, "") as string;

	const hash = new SHA3(256).update(promptString).digest("hex");

	try {
		const res = await fetch(
			`${process.env.NEXTAUTH_URL}/api/taobai/${hash}/handler`,
			{
				method: "GET",
				headers: {
					Cookie: `session=${session}`,
				},
			},
		);

		const data = await res.json();
		if (!data.status) {
			return data.message;
		}

		// Set assignment_id cookie
		await Promise.all([
			fetch(`${process.env.NEXTAUTH_URL}/api/taobai/${hash}/bot`, {
				method: "POST",
				body: JSON.stringify({
					_class: _class,
					subject: subject,
					prompt: prompt,
				}),
			}),
			// fetch(`${process.env.NEXTAUTH_URL}/api/cookie`, {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		name: "assignment_id",
			// 		data: data.message,
			// 	}),
			// }),
		]);

		return "";
	} catch (error) {
		console.error("Error in handler:", error);
		return "Internal server error";
	}
}
