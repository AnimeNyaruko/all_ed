import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
	const { refreshAuthState } = useAuth();
	const router = useRouter();

	const handleGoogleLogin = async () => {
		try {
			const emailInput = document.querySelector(
				'input[name="email"]',
			) as HTMLInputElement;
			const email = emailInput?.value;

			if (!email) {
				const result = await signIn("google", {
					redirect: false,
					callbackUrl: "/",
				});
				
				if (result?.ok) {
					await refreshAuthState();
					router.push("/");
				}
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
					await refreshAuthState();
					router.push("/");
				}
			} else {
				const result = await signIn("google", {
					redirect: false,
					callbackUrl: "/",
				});
				
				if (result?.ok) {
					await refreshAuthState();
					router.push("/");
				}
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
