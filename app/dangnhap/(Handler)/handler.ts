"use server";
import { parseEmailtoUsername } from "@/utils/parseEmail";
import { setCookie } from "@/utils/cookie";

export async function login(formData: FormData) {
	//parsing email to create username
	const email = formData.get("email")!.toString();
	const username = parseEmailtoUsername(email);

	//fetching to /api/login to make login request
	const response = await fetch(`${process.env.NEXTAUTH_URL!}/api/login`, {
		body: formData,
		method: "POST",
	});
	const data = await response.json();
	//If returned data contain any message -> error occured -> return to client side error message
	if (data !== "") {
		return data;
	}

	//If returned data does not contain any message -> successfully -> set session
	await setCookie("session", username);

	return "";
}

export async function register(formData: FormData) {
	//parsing email to create username
	const email = formData.get("email")!.toString();
	const username = parseEmailtoUsername(email);

	//appending username to current formdata
	formData.append("username", username);

	//fetching to /api/register to make register request
	const response = await fetch(`${process.env.NEXTAUTH_URL}/api/register`, {
		body: formData,
		method: "POST",
	});
	const data = await response.json();

	//If returned data contain any message -> error occured -> return to client side error message
	if (data !== "") {
		return data;
	}

	//If returned data does not contain any message -> successfully -> set session
	await setCookie("session", username);

	return "";
}
