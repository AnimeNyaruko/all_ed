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

	const res = await fetch(`${process.env.NEXTAUTH_TEST_URL}/api/${hash}/bot`, {
		method: "POST",
		body: formData,
	});

	const data = await res.json();

	console.log(data);
}
