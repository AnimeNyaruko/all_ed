"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { checkCookie, deleteCookie } from "@/utils/cookie";
import Image from "next/image";
import { signOut } from "next-auth/react";

// Định nghĩa interface cho cờ
interface Flag {
	id: string;
	left: number;
	size: number;
	delay: number;
	duration: number;
	rotation: number;
	wobbleStrength: number;
}

// Component FallingFlags để tạo hiệu ứng cờ rơi
const FallingFlags = ({
	flagImage,
	count = 20,
}: {
	flagImage: string;
	count?: number;
}) => {
	const [flags, setFlags] = useState<Flag[]>([]);

	const createFlag = useCallback((): Flag => {
		return {
			id: Math.random().toString(36).substring(7),
			left: Math.random() * 100, // Vị trí ngang (%)
			size: Math.random() * (30 - 10) + 10, // Kích thước cờ (10-30px)
			delay: Math.random() * 1, // Độ trễ bắt đầu rơi (0-1s)
			duration: Math.random() * (15 - 8) + 8, // Thời gian rơi (8-15s)
			rotation: Math.random() + 360, // Góc xoay ngẫu nhiên
			wobbleStrength: Math.random() * 2 + 1, // Cường độ đung đưa
		};
	}, []);

	useEffect(() => {
		const newFlags: Flag[] = [];
		for (let i = 0; i < count; i++) {
			newFlags.push(createFlag());
		}
		setFlags(newFlags);

		// Tạo cờ mới sau khi một lá cờ đã rơi xong
		const interval = setInterval(() => {
			setFlags((prevFlags) => {
				if (prevFlags.length < count) {
					return [...prevFlags, createFlag()];
				} else {
					const newFlags = [...prevFlags];
					newFlags[Math.floor(Math.random() * newFlags.length)] = createFlag();
					return newFlags;
				}
			});
		}, 3000);

		return () => clearInterval(interval);
	}, [count, createFlag]);

	return (
		<div className="inset-0 pointer-events-none absolute overflow-hidden">
			{flags.map((flag) => (
				<div
					key={flag.id}
					className="top-0 absolute z-10"
					style={{
						left: `${flag.left}%`,
						width: `${flag.size}px`,
						height: `${flag.size}px`,
						animation: `fall ${flag.duration}s linear ${flag.delay}s infinite, wobble ${flag.wobbleStrength}s ease-in-out infinite alternate`,
						transform: `rotate(${flag.rotation}deg)`,
					}}
				>
					{flagImage && (
						<Image
							src={flagImage}
							alt="Lá cờ"
							width={flag.size}
							height={flag.size}
							className="h-auto w-full"
						/>
					)}
				</div>
			))}
			<style jsx global>{`
				@keyframes fall {
					0% {
						transform: translateY(-100px) rotate(${Math.random() * 360}deg);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					95% {
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotate(${Math.random() * 360}deg);
						opacity: 0;
					}
				}
				@keyframes wobble {
					0% {
						margin-left: -5px;
					}
					100% {
						margin-left: 5px;
					}
				}
			`}</style>
		</div>
	);
};

export default function Header() {
	const [hasSession, setHasSession] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	// Đường dẫn hình ảnh cờ - cần thay thế bằng đường dẫn thực tế
	const flagImagePath = "/images/flag.png"; // Giả định đường dẫn

	useEffect(() => {
		setIsMounted(true);
	}, []);

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

	const scrollToFooter = (e: React.MouseEvent) => {
		e.preventDefault();
		const footer = document.getElementById("footer");
		if (!footer) return;

		const duration = 800; // Thời gian cuộn: 800ms (0.8s)
		const startPosition = window.scrollY;
		const targetPosition = footer.getBoundingClientRect().top + window.scrollY;
		const distance = targetPosition - startPosition;
		let startTime: number | null = null;

		function animation(currentTime: number) {
			if (startTime === null) startTime = currentTime;
			const timeElapsed = currentTime - startTime;
			const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
			window.scroll({ top: run, behavior: "smooth" });
			if (timeElapsed < duration) requestAnimationFrame(animation);
		}

		// Hàm easing để làm cho cuộn mượt mà hơn
		function easeInOutQuad(t: number, b: number, c: number, d: number) {
			t /= d / 2;
			if (t < 1) return (c / 2) * t * t + b;
			t--;
			return (-c / 2) * (t * (t - 2) - 1) + b;
		}

		requestAnimationFrame(animation);
	};

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
				href="/ve-chung-toi"
				className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
			>
				Về chúng tôi
			</Link>
			<a
				onClick={scrollToFooter}
				className="text-gray-700 hover:text-blue-600 font-medium py-2 cursor-pointer transition-colors"
			>
				Liên hệ
			</a>
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
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block cursor-pointer"
							>
								Lịch sử làm bài
							</Link>
							<div
								onClick={async () => {
									await deleteCookie("session");
									await deleteCookie("assignment_id");
									await signOut();
									window.location.href = "/";
								}}
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block cursor-pointer"
							>
								Đăng xuất
							</div>
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
					<Link href="/" className="space-x-2 flex items-center">
						<div className="w-10 h-10 from-blue-600 to-purple-600 rounded-lg flex items-center justify-center bg-gradient-to-r">
							<span className="text-white text-xl font-bold">A</span>
						</div>
						<div className="text-2xl font-bold from-blue-600 to-purple-600 bg-gradient-to-r bg-clip-text text-transparent">
							The AllEd
						</div>
					</Link>
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
				{isMounted && <FallingFlags flagImage={flagImagePath} count={15} />}
			</nav>
		</header>
	);
}
