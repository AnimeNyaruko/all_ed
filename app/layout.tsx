import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/ui/final.css";

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
				{children}
			</body>
		</html>
	);
}
