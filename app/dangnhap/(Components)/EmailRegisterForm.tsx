import { ChangeEvent, FormEvent, useState } from "react";
import { register } from "../(Handler)/handler";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function EmailRegisterForm() {
	const [error, setError] = useState("");
	const [passwordMatch, setPasswordMatch] = useState(true);
	const router = useRouter();
	const { refreshAuthState } = useAuth();
	const { showToast } = useToast();

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		const password = (document.getElementById("password") as HTMLInputElement)
			?.value;
		const rePassword = e.target.value;

		if (password && rePassword) {
			const match = password === rePassword;
			setPasswordMatch(match);
			e.target.classList.remove(
				match ? "focus:border-red-500" : "focus:border-green-500",
				match ? "focus:ring-red-500" : "focus:ring-green-500",
			);
			e.target.classList.add(
				match ? "focus:border-green-500" : "focus:border-red-500",
				match ? "focus:ring-green-500" : "focus:ring-red-500",
			);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		if (!passwordMatch) {
			setError("Mật khẩu không khớp");
			showToast("Mật khẩu không khớp", "error");
			return;
		}

		showToast("Đang đăng ký tài khoản...", "loading");
		const result = await register(formData);

		if (result === "") {
			await refreshAuthState();
			showToast("Đăng ký thành công!", "success");
			router.push("/");
		} else {
			setError(result);
			showToast(`Lỗi: ${result}`, "error");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="text-base font-semibold text-black mb-2 block">
					Email
				</label>
				<input
					required
					type="email"
					name="email"
					className="mt-1 px-4 py-2.5 rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-black block w-full border transition-colors outline-none focus:ring-1"
					placeholder="example@email.com"
				/>
			</div>

			<div>
				<label className="text-base font-semibold text-black mb-2 block">
					Mật khẩu
				</label>
				<input
					required
					id="password"
					type="password"
					name="password"
					className="mt-1 px-4 py-2.5 rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-black block w-full border transition-colors outline-none focus:ring-1"
					placeholder="Password"
				/>
			</div>

			<div>
				<label className="text-base font-semibold text-black mb-2 block">
					Xác nhận mật khẩu
				</label>
				<input
					required
					type="password"
					name="re-password"
					onChange={handlePasswordChange}
					className="mt-1 px-4 py-2.5 rounded-md border-gray-200 text-black focus:border-blue-500 focus:ring-blue-500 block w-full border transition-colors outline-none focus:ring-1"
					placeholder="Password"
				/>
			</div>

			{error && (
				<div className="p-3 bg-red-400 rounded-md text-md font-bold text-black text-center">
					{error}
				</div>
			)}

			<button
				type="submit"
				className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-blue-500 text-lg font-semibold w-full cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-none"
			>
				Đăng ký
			</button>
		</form>
	);
}
