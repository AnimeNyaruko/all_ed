"use server";
import { SHA3 } from "sha3";

export async function handler(formData: FormData) {
	const prompt = formData.getAll("prompt");

	const promptString = prompt.reduce((prev, curr) => {
		prev = prev.toString();
		curr = curr.toString();
		return prev + curr;
	}, "") as string;

	const hash = new SHA3(256).update(promptString).digest("hex");

	const res = await fetch(
		`${process.env.NEXTAUTH_URL}/api/taobai/${hash}/handler`,
		{
			method: "GET",
		},
	);

	//Create a perfect prompt.

	const data = await res.json();
	if (!data.status) {
		return data.message;
	}

	fetch(`${process.env.NEXTAUTH_URL}/api/cookie`, {
		method: "POST",
		body: JSON.stringify({
			name: "assignment_id",
			data: data.message,
		}),
	});

	return "";
}
