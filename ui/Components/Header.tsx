"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { checkCookie } from "@/utils/cookie";

export default function Header() {
	const [hasSession, setHasSession] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const checkSession = async () => {
			const hasSessionCookie = await checkCookie("session");
			setHasSession(hasSessionCookie);
		};
		checkSession();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".profile-dropdown")) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const NavLinks = ({ isMobile = false }) => (
		<div
			className={`${isMobile ? "space-y-4 flex flex-col" : "space-x-8 flex items-center"}`}
		>
			<Link
				href="/"
				className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
			>
				Trang chủ
			</Link>
			<Link
				href="/taobai"
				className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
			>
				Tạo bài tập
			</Link>
			<Link
				href="/about"
				className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
			>
				Về chúng tôi
			</Link>
			<Link
				href="/contact"
				className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
			>
				Liên hệ
			</Link>
			{hasSession ? (
				<div className="profile-dropdown relative">
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="w-10 h-10 bg-white border-gray-200 hover:border-blue-500 flex cursor-pointer items-center justify-center rounded-full border-2 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-gray-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</button>
					{isDropdownOpen && (
						<div
							className={`${isMobile ? "relative" : "absolute"} right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50`}
						>
							<Link
								href="/lambai/selection"
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block"
							>
								Lịch sử làm bài
							</Link>
							<Link
								href="/logout"
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block"
							>
								Đăng xuất
							</Link>
						</div>
					)}
				</div>
			) : (
				<Link
					href="/dangnhap"
					className="from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-md inline-block bg-gradient-to-r transition-colors"
				>
					Đăng nhập
				</Link>
			)}
		</div>
	);

	return (
		<header className="bg-white/95 backdrop-blur-md shadow-lg fixed z-50 w-full">
			<nav className="px-6 py-4 container mx-auto">
				<div className="flex items-center justify-between">
					<div className="space-x-2 flex items-center">
						<div className="w-10 h-10 from-blue-600 to-purple-600 rounded-lg flex items-center justify-center bg-gradient-to-r">
							<span className="text-white text-xl font-bold">A</span>
						</div>
						<div className="text-2xl font-bold from-blue-600 to-purple-600 bg-gradient-to-r bg-clip-text text-transparent">
							The AllEd
						</div>
					</div>
					<div className="md:flex hidden">
						<NavLinks />
					</div>
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden text-gray-700 hover:text-blue-600 p-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
				{isMobileMenuOpen && (
					<div className="md:hidden mt-4 px-2 py-4 border-t">
						<NavLinks isMobile={true} />
					</div>
				)}
			</nav>
		</header>
	);
}
