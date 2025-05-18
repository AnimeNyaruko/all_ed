import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

// Constants for API endpoints
const API_CHECK_EMAIL = "/api/auth/check-email";
const API_COOKIE = "/api/cookie";
const HOME_PATH = "/";

export default function GoogleLoginButton() {
	const { refreshAuthState } = useAuth();
	const router = useRouter();
	const { showToast } = useToast();

	// Handle successful login logic
	const handleLoginSuccess = async () => {
		await refreshAuthState();
		showToast("Đăng nhập thành công!", "success");
		router.push(HOME_PATH);
	};

	const handleGoogleLogin = async () => {
		try {
			showToast("Đang đăng nhập với Google...", "loading");
			
			const emailInput = document.querySelector(
				'input[name="email"]',
			) as HTMLInputElement;
			const email = emailInput?.value;

			if (!email) {
				const result = await signIn("google", {
					redirect: false,
					callbackUrl: HOME_PATH,
				});
				
				if (result?.ok) {
					await handleLoginSuccess();
				} else {
					showToast("Đăng nhập thất bại. Vui lòng thử lại.", "error");
				}
				return;
			}

			try {
				const res = await fetch(API_CHECK_EMAIL, {
					method: "POST",
					body: JSON.stringify({ email }),
					headers: { "Content-Type": "application/json" },
				});

				if (!res.ok) {
					throw new Error(`Kiểm tra email thất bại: ${res.status}`);
				}

				const data = await res.json();
				if (data.exists) {
					const cookieResponse = await fetch(API_COOKIE, {
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
						await handleLoginSuccess();
					} else {
						throw new Error(`Thiết lập cookie thất bại: ${cookieResponse.status}`);
					}
				} else {
					const result = await signIn("google", {
						redirect: false,
						callbackUrl: HOME_PATH,
					});
					
					if (result?.ok) {
						await handleLoginSuccess();
					} else {
						throw new Error("Đăng nhập Google thất bại");
					}
				}
			} catch (fetchError) {
				console.error("API request error:", fetchError);
				showToast(`Lỗi kết nối: ${(fetchError as Error).message}`, "error");
			}
		} catch (error) {
			console.error("Google sign-in error:", error);
			showToast(`Lỗi đăng nhập với Google: ${(error as Error).message}`, "error");
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
