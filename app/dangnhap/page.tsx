"use server";
import LoginUI from "./(UI)/loginUI";
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import setCookie from "@/utils/setCookie";
import { signIn } from "next-auth/react";

async function getCsrfToken() {
	const response = await fetch(`http://localhost:3000/api/auth/csrf`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch CSRF token");
	}

	const data = await response.json();
	return data.csrfToken;
}
function parseEmailtoUsername(email: string): string {
	let substring = 0;
	for (let i of email) {
		substring++;
		if (i === "@") {
			substring--;
			break;
		}
	}
	return email.slice(0, substring);
}
export async function login(path: string, formData: FormData) {
	//parsing email to create username
	const email = formData.get("email")!.toString();
	const username = parseEmailtoUsername(email);

	//fetching to /api/login to make login request
	const response = await fetch(path, {
		body: formData,
		method: "POST",
	});
	const data = await response.json();
	//If returned data contain any message -> error occured -> return to client side error message
	if (data !== "") {
		return data;
	}
	//If returned data does not contain any message -> successfully -> set session
	setCookie("session", username, {
		secure: true,
		maxAge: 30 * 24 * 60 * 60,
	});
	return "";
}
export async function register(path: string, formData: FormData) {
	//parsing email to create username
	const email = formData.get("email")!.toString();
	const username = parseEmailtoUsername(email);

	//appending username to current formdata
	formData.append("username", username);

	//fetching to /api/register to make register request
	const response = await fetch(path, {
		body: formData,
		method: "POST",
	});
	const data = await response.json();

	//If returned data contain any message -> error occured -> return to client side error message
	if (data !== "") {
		return data;
	}

	//If returned data does not contain any message -> successfully -> set session
	setCookie("session", username, {
		secure: true,
		maxAge: 30 * 24 * 60 * 60,
	});
	return "";
}

export default async function Page() {
	return <LoginUI />;
}
