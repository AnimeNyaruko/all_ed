import { FormEvent, useState } from "react";
import { login } from "../(Handler)/handler";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EmailLoginForm() {
	const [error, setError] = useState("");
	const router = useRouter();
	const { refreshAuthState } = useAuth();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const result = await login(formData);

		if (result === "") {
			await refreshAuthState();
			router.push("/");
		} else {
			setError(result);
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
					type="password"
					name="password"
					className="mt-1 px-4 py-2.5 rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-black block w-full border transition-colors outline-none focus:ring-1"
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
				Đăng nhập
			</button>
		</form>
	);
}
