import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/ui/final.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/ui/Style/toast.css";
import AppShell from "@/ui/Components/AppShell";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "The AllEd",
	description: "The AllEd",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<meta
				name="google-site-verification"
				content="HF0sxsdMjfho0t19RVs6p4Rg1yw2Ud6jBciPt4gjyfA"
			/>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider>
					<ToastProvider>
						<AppShell>{children}</AppShell>
						<ToastContainer 
							position="top-center"
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={true}
							closeOnClick={true}
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme="light"
						/>
					</ToastProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
