"use server";
import { SHA3 } from "sha3";
import { redirect } from "next/navigation";
import { getCookie, setCookie } from "@/utils/cookie";
export async function handler(formData: FormData) {
	const prompt = formData.getAll("prompt");
	const _class = formData.getAll("class");
	const subject = formData.getAll("subject");
	const level = formData.getAll("level");
	const quantity = formData.get("quantity");
	const session = await getCookie("session");

	if (!session) {
		return "User not authenticated";
	}

	const promptString = prompt.reduce((prev, curr) => {
		prev = prev.toString();
		curr = curr.toString();
		return prev + curr;
	}, "") as string;

	const hash = new SHA3(256)
		.update(`${promptString}${Math.random() * 1000000000 + 1}`)
		.digest("hex");
	const data_string = `${prompt.reduce((prev, curr, index: number) => {
		return `${prev.toString()}${index === 0 ? "" : "\\n"}Lớp: ${_class[index]} - Môn: ${subject[index]} - Bài tập: ${curr.toString()} - Cấp độ: ${level[index]}`;
	}, "")}\\nSố lượng: ${quantity}`;

	try {
		const res = await fetch(
			`${process.env.NEXTAUTH_URL}/api/taobai/${hash}/handler`,
			{
				method: "POST",
				body: JSON.stringify({
					data: data_string,
				}),
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
		Promise.all([
			setCookie("assignment_id", data.message),
			fetch(`${process.env.NEXTAUTH_URL}/api/taobai/${hash}/bot`, {
				method: "POST",
				body: JSON.stringify({
					_class,
					subject,
					prompt,
					level,
					quantity,
					username: session,
					assignmentId: data.message,
				}),
			}),
		]);
		// Only redirect if cookie was successfully set and verified
	} catch (error) {
		console.error("Error in handler:", error);
		return "Internal server error";
	}
	redirect(`/lambai`);
}
