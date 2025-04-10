import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
	const handleGoogleLogin = async () => {
		try {
			const emailInput = document.querySelector(
				'input[name="email"]',
			) as HTMLInputElement;
			const email = emailInput?.value;

			if (!email) {
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
	};

	return (
		<button
			type="button"
			onClick={handleGoogleLogin}
			className="gap-2 bg-white border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:ring-gray-500 text-lg font-semibold flex w-full cursor-pointer items-center justify-center border focus:ring-2 focus:ring-offset-2 focus:outline-none"
		>
			<FontAwesomeIcon icon={faGoogle} className="text-red-600" />
			Đăng nhập với Google
		</button>
	);
}
