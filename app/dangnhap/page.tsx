"use client";
import Footer from "@/ui/Components/Footer";
import Header from "@/ui/Components/Header";
import { useState } from "react";
import EmailLoginForm from "./(Components)/EmailLoginForm";
import EmailRegisterForm from "./(Components)/EmailRegisterForm";
import GoogleLoginButton from "./(Components)/GoogleLoginButton";

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

						{isLogin ? <EmailLoginForm /> : <EmailRegisterForm />}

						<div className="my-4 relative">
							<div className="inset-0 absolute flex items-center">
								<div className="border-gray-300 w-full border-t"></div>
							</div>
							<div className="text-sm relative flex justify-center">
								<span className="px-2 bg-white text-gray-500">Hoặc</span>
							</div>
						</div>

						<GoogleLoginButton />

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
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
