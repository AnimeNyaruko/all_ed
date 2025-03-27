"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Header from "@/ui/Components/Header";
import Footer from "@/ui/Components/Footer";
// import { signIn } from "next-auth/react";

async function checkForm(formData: FormData) {
	if (formData.has("Google")) {
		console.log("temp");
		// signIn("google");
	}
	return;
}

export default function Page() {
	const [isLogin, setIsLogin] = useState(true);
	return (
		<>
			<Header />
			<div className="bg-gray-100 pt-20 flex min-h-screen items-center justify-center">
				<div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
					<div className="p-8">
						<h2 className="text-3xl font-bold mb-6 text-black text-center">
							{isLogin ? "Đăng nhập" : "Đăng ký"}
						</h2>

						<form action={checkForm} className="space-y-4">
							<div>
								<label className="text-base font-semibold text-black mb-2 block">
									Email
								</label>
								<input
									type="email"
									className="mt-1 px-4 py-2.5 rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-black block w-full border transition-colors outline-none focus:ring-1"
									placeholder="example@email.com"
								/>
							</div>

							<div>
								<label className="text-base font-semibold text-black mb-2 block">
									Mật khẩu
								</label>
								<input
									type="password"
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
										type="password"
										className="mt-1 px-4 py-2.5 rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-black block w-full border transition-colors outline-none focus:ring-1"
										placeholder="Password"
									/>
								</div>
							)}

							<button
								type="submit"
								className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-blue-500 text-lg font-semibold w-full focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
								name="Google"
								type="submit"
								className="gap-2 bg-white border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:ring-gray-500 text-lg font-semibold flex w-full items-center justify-center border focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								<FontAwesomeIcon icon={faGoogle} className="text-red-600" />
								Đăng nhập với Google
							</button>

							<p className="text-sm text-gray-600 mt-4 text-center">
								{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
								<button
									type="button"
									onClick={() => setIsLogin(!isLogin)}
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
