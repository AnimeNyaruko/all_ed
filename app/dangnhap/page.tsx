"use client";
import Footer from "@/ui/Components/Footer";
import Header from "@/ui/Components/Header";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useState } from "react";
import clsx from "clsx";
import { login, register } from "./(Handler)/handler";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";

async function googleLogin() {
	try {
		const emailInput = document.querySelector(
			'input[name="email"]',
		) as HTMLInputElement;
		const email = emailInput?.value;

		if (!email) {
			console.log("google login");
			await signIn("google", {
				callbackUrl: "/",
			});
			return;
		}

		const res = await fetch(`/api/auth/check-email`, {
			method: "POST",
			body: JSON.stringify({ email }),
			headers: { "Content-Type": "application/json" },
		});

		const data = await res.json();
		if (data.exists) {
			const cookieResponse = await fetch(`/api/cookie`, {
				method: "POST",
				body: JSON.stringify({
					username: data.username,
					data: data.email,
					option: {
						httpOnly: true,
						secure: window.location.protocol === "https:",
						sameSite: "lax",
						maxAge: 30 * 24 * 60 * 60,
					},
				}),
				headers: { "Content-Type": "application/json" },
			});

			if (cookieResponse.ok) {
				// Wait a small delay to ensure cookie is set
				await new Promise((resolve) => setTimeout(resolve, 100));
				window.location.href = "/";
			}
		} else {
			await signIn("google", {
				callbackUrl: "/",
			});
		}
	} catch (error) {
		console.error("Google sign-in error:", error);
	}
}

async function checkForm(formData: FormData): Promise<string> {
	let result = "Đợi một tí";

	if (formData.has("password")) {
		// Call googleLogin directly
		await googleLogin();
		result = "";
	} else if (!formData.has("re-password")) {
		const path = `/api/login`;
		result = await login(path, formData);
	} else if (formData.has("re-password")) {
		const path = `/api/register`;
		result = await register(path, formData);
	}
	if (result === "") {
		redirect("/");
	}
	return result;
}

export default function Page() {
	const [isLogin, setIsLogin] = useState(true);
	const [progress, setProgress] = useState("");
	return (
		<>
			<Header />
			<div className="bg-gray-100 pt-20 flex min-h-screen items-center justify-center">
				<div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
					<div className="p-8">
						<h2
							className={clsx(
								"p-3 bg-red-400 rounded-md text-md font-bold mb-6 text-black text-center",
								{
									hidden: progress === "",
									block: progress !== "",
								},
							)}
						>
							{progress}
						</h2>
						<h2 className="text-3xl font-bold mb-6 text-black text-center">
							{isLogin ? "Đăng nhập" : "Đăng ký"}
						</h2>

						<form
							onSubmit={async (event: FormEvent<HTMLFormElement>) => {
								event.preventDefault();
								const formData = new FormData(event.currentTarget);
								const result = await checkForm(formData);
								setProgress(result);
							}}
							className="space-y-4"
						>
							<div>
								<label className="text-base font-semibold text-black mb-2 block">
									Email
								</label>
								<input
									type="email"
									name="email" // Ensure this matches the key used in FormData
									className="mt-1 px-4 py-2.5 rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-black block w-full border transition-colors outline-none focus:ring-1"
									placeholder="example@email.com"
								/>
							</div>

							<div>
								<label className="text-base font-semibold text-black mb-2 block">
									Mật khẩu
								</label>
								<input
									id="password"
									type="password"
									name="password" // Ensure this matches the key used in FormData
									className="mt-1 px-4 py-2.5 rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-black block w-full border transition-colors outline-none focus:ring-1"
									placeholder="Password"
								/>
							</div>

							{!isLogin && (
								<div>
									<label className="text-base font-semibold text-black mb-2 block">
										Xác nhận mật khẩu
									</label>
									<input
										onChange={(e: ChangeEvent<HTMLInputElement>) => {
											const enteredPass = (
												document.getElementById("password") as HTMLInputElement
											)?.value;

											const re_pass = e.target.value;
											if (enteredPass !== "" && re_pass === enteredPass) {
												e.target.classList.remove(
													"focus:border-red-500",
													"focus:ring-red-500",
												);
												e.target.classList.add(
													"focus:border-green-500",
													"focus:ring-green-500",
												);
											} else {
												e.target.classList.remove(
													"focus:border-blue-500",
													"focus:ring-blue-500",
												);
												e.target.classList.add(
													"focus:border-red-500",
													"focus:ring-red-500",
												);
											}
										}}
										type="password"
										name="re-password"
										className="mt-1 px-4 py-2.5 rounded-md border-gray-200 text-black focus:border-blue-500 focus:ring-blue-500 block w-full border transition-colors outline-none focus:ring-1"
										placeholder="Password"
									/>
								</div>
							)}

							<button
								type="submit"
								name={isLogin ? "login" : "register"}
								className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-blue-500 text-lg font-semibold w-full cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								{isLogin ? "Đăng nhập" : "Đăng ký"}
							</button>

							<div className="my-4 relative">
								<div className="inset-0 absolute flex items-center">
									<div className="border-gray-300 w-full border-t"></div>
								</div>
								<div className="text-sm relative flex justify-center">
									<span className="px-2 bg-white text-gray-500">Hoặc</span>
								</div>
							</div>

							<button
								name="google"
								type="button" // Changed to "button" to prevent form submission
								onClick={googleLogin} // Call googleLogin on button click
								className="gap-2 bg-white border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:ring-gray-500 text-lg font-semibold flex w-full cursor-pointer items-center justify-center border focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								<FontAwesomeIcon icon={faGoogle} className="text-red-600" />
								Đăng nhập với Google
							</button>

							<p className="text-sm text-gray-600 mt-4 text-center">
								{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
								<button
									type="button"
									onClick={() => {
										setIsLogin(!isLogin);
										setProgress("");
									}}
									className="text-blue-600 hover:text-blue-800 font-semibold"
								>
									{isLogin ? "Đăng ký ngay" : "Đăng nhập"}
								</button>
							</p>
						</form>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
