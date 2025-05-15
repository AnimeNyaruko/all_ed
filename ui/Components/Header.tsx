"use client";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { scrollToElementById } from "@/utils/scrollUtils";

// Tách hàm easing ra khỏi component chính để tránh tạo lại khi re-render
// const easeInOutQuad = (t: number, b: number, c: number, d: number) => { // Đã chuyển sang scrollUtils.ts
// 	t /= d / 2;
// 	if (t < 1) return (c / 2) * t * t + b;
// 	t--;
// 	return (-c / 2) * (t * (t - 2) - 1) + b;
// };

// Tối ưu hóa component con AuthSection bằng memo
const AuthSection = memo(({ 
	isMobile = false,
	effectiveAuthState,
	isAuthLoading,
	cachedAuthState,
	shouldShowSkeleton,
	isDropdownOpen,
	setIsDropdownOpen,
	logout,
}: { 
	isMobile?: boolean,
	effectiveAuthState: boolean | null,
	isAuthLoading: boolean,
	cachedAuthState: boolean | null,
	shouldShowSkeleton: boolean,
	isDropdownOpen: boolean,
	setIsDropdownOpen: (value: boolean) => void,
	logout: () => Promise<void>,
}) => {
	// Kết hợp logic skeleton và trạng thái hiệu quả
	if (shouldShowSkeleton && cachedAuthState === null) {
		return (
			<div className="w-24 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
		);
	}
	
	// Xử lý trường hợp isAuthLoading && cachedAuthState === null nhưng chưa tới thời điểm hiển thị skeleton
	if (isAuthLoading && cachedAuthState === null && !shouldShowSkeleton) {
		// Trả về một phần tử trống với kích thước tương đương để tránh nhảy layout
		return <div className="w-24 h-10 opacity-0"></div>;
	}
	
	// Sử dụng trạng thái hiệu quả (cached hoặc isLoggedIn)
	// Nếu effectiveAuthState là null (chưa xác định), ẩn nút
	if (effectiveAuthState === null) {
		return <div className="w-24 h-10 opacity-0"></div>;
	}
	
	// Tối ưu callbacks cho các sự kiện
	const handleDropdownToggle = useCallback((e: React.MouseEvent) => {
		e.stopPropagation(); // Ngăn sự kiện lan ra document
		setIsDropdownOpen(!isDropdownOpen);
	}, [isDropdownOpen, setIsDropdownOpen]);
	
	return effectiveAuthState ? (
		<div className="profile-dropdown relative">
			<button
				onClick={handleDropdownToggle}
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
						onClick={() => logout()}
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
	);
});

AuthSection.displayName = 'AuthSection';

// Tối ưu hóa component con NavLinks bằng memo
const NavLinks = memo(({ 
	isMobile = false,
	scrollToFooter,
	effectiveAuthState,
	isAuthLoading,
	cachedAuthState,
	shouldShowSkeleton,
	isDropdownOpen,
	setIsDropdownOpen,
	logout,
}: { 
	isMobile?: boolean,
	scrollToFooter: (e: React.MouseEvent) => void,
	effectiveAuthState: boolean | null,
	isAuthLoading: boolean,
	cachedAuthState: boolean | null,
	shouldShowSkeleton: boolean,
	isDropdownOpen: boolean,
	setIsDropdownOpen: (value: boolean) => void,
	logout: () => Promise<void>,
}) => (
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
		<AuthSection 
			isMobile={isMobile}
			effectiveAuthState={effectiveAuthState}
			isAuthLoading={isAuthLoading}
			cachedAuthState={cachedAuthState}
			shouldShowSkeleton={shouldShowSkeleton}
			isDropdownOpen={isDropdownOpen}
			setIsDropdownOpen={setIsDropdownOpen}
			logout={logout}
		/>
	</div>
));

NavLinks.displayName = 'NavLinks';

export default function Header() {
	const { isLoggedIn, isAuthLoading, logout: authLogout } = useAuth();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [cachedAuthState, setCachedAuthState] = useState<boolean | null>(null);
	
	// Thêm state để quản lý việc hiển thị skeleton
	const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);
	const skeletonTimerRef = useRef<NodeJS.Timeout | null>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);

	// Đọc trạng thái auth từ sessionStorage khi component được mount
	useEffect(() => {
		setIsMounted(true);
		
		// Đọc trạng thái auth từ sessionStorage
		if (typeof window !== 'undefined') {
			try {
				const savedState = sessionStorage.getItem('AUTH_STATE');
				if (savedState !== null) {
					setCachedAuthState(JSON.parse(savedState));
				}
			} catch (error) {
				console.error("Error reading from sessionStorage:", error);
			}
		}
	}, []);

	// Lưu trạng thái auth vào sessionStorage và cập nhật cachedAuthState
	useEffect(() => {
		if (!isAuthLoading && isLoggedIn !== null) {
			setCachedAuthState(isLoggedIn);
			
			// Lưu vào sessionStorage để tái sử dụng cho lần sau
			try {
				sessionStorage.setItem('AUTH_STATE', JSON.stringify(isLoggedIn));
			} catch (error) {
				console.error("Error writing to sessionStorage:", error);
			}
		}
	}, [isLoggedIn, isAuthLoading]);
	
	// Quản lý hiển thị skeleton với một khoảng thời gian tối thiểu
	useEffect(() => {
		// Nếu bắt đầu loading và không có dữ liệu cache
		if (isAuthLoading && cachedAuthState === null) {
			// Đặt một timer để chỉ hiển thị skeleton sau 150ms
			// Điều này giúp tránh hiển thị skeleton cho các trường hợp loading rất nhanh
			if (skeletonTimerRef.current) {
				clearTimeout(skeletonTimerRef.current);
			}
			
			skeletonTimerRef.current = setTimeout(() => {
				if (isAuthLoading) { // Kiểm tra lại xem vẫn đang loading không
					setShouldShowSkeleton(true);
				}
			}, 150);
		} else {
			// Nếu không còn loading hoặc đã có dữ liệu cache
			if (skeletonTimerRef.current) {
				clearTimeout(skeletonTimerRef.current);
			}
			
			// Sử dụng thời gian chuyển đổi nhẹ nhàng để tránh việc thay đổi đột ngột
			// Điều này giúp tránh hiệu ứng nhấp nháy
			setTimeout(() => {
				setShouldShowSkeleton(false);
			}, 50);
		}
		
		return () => {
			if (skeletonTimerRef.current) {
				clearTimeout(skeletonTimerRef.current);
			}
		};
	}, [isAuthLoading, cachedAuthState]);

	// Tối ưu xử lý click outside dropdown
	const handleClickOutside = useCallback((event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest(".profile-dropdown") && isDropdownOpen) {
			setIsDropdownOpen(false);
		}
	}, [isDropdownOpen]);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [handleClickOutside]);

	// Tối ưu hàm cuộn mượt đến footer
	const scrollToFooter = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		// const footer = document.getElementById("footer"); // Logic cũ
		// if (!footer) return;

		// const duration = 800; 
		// const startPosition = window.scrollY;
		// const targetPosition = footer.getBoundingClientRect().top + window.scrollY;
		// const distance = targetPosition - startPosition;
		// let startTime: number | null = null;

		// function animation(currentTime: number) {
		// 	if (startTime === null) startTime = currentTime;
		// 	const timeElapsed = currentTime - startTime;
		// 	const run = easeInOutQuad(timeElapsed, startPosition, distance, duration); // Sử dụng easeInOutQuad từ scrollUtils
		// 	window.scroll({ top: run, behavior: "smooth" });
		// 	if (timeElapsed < duration) requestAnimationFrame(animation);
		// }

		// requestAnimationFrame(animation);
		scrollToElementById("footer", 800); // Sử dụng hàm tiện ích mới
	}, []);

	// Đơn giản hóa logic xác định trạng thái hiển thị auth - ưu tiên sử dụng dữ liệu cache khi đang loading
	const effectiveAuthState = isAuthLoading ? cachedAuthState : isLoggedIn;

	// Tối ưu toggle mobile menu với hiệu ứng mở/đóng mượt mà
	const toggleMobileMenu = useCallback(() => {
		setIsMobileMenuOpen(prev => !prev);
	}, []);

	const logout = async () => {
		await authLogout();
		window.location.href = '/';
	};

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
						<NavLinks 
							scrollToFooter={scrollToFooter}
							effectiveAuthState={effectiveAuthState}
							isAuthLoading={isAuthLoading}
							cachedAuthState={cachedAuthState}
							shouldShowSkeleton={shouldShowSkeleton}
							isDropdownOpen={isDropdownOpen}
							setIsDropdownOpen={setIsDropdownOpen}
							logout={logout}
						/>
					</div>
					<button
						onClick={toggleMobileMenu}
						className="md:hidden text-gray-700 hover:text-blue-600 p-2"
						aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
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
								d={isMobileMenuOpen 
                  ? "M6 18L18 6M6 6l12 12" // X icon khi menu đã mở
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger icon khi menu đóng
                }
							/>
						</svg>
					</button>
				</div>
				<div
					ref={mobileMenuRef}
					className={`md:hidden mt-4 px-2 py-4 border-t transition-all duration-300 overflow-hidden ${
						isMobileMenuOpen 
							? "max-h-96 opacity-100" 
							: "max-h-0 opacity-0 border-t-0"
					}`}
				>
					{/* Luôn render NavLinks nhưng ẩn bằng CSS để có hiệu ứng mượt mà */}
					<NavLinks 
						isMobile={true}
						scrollToFooter={scrollToFooter}
						effectiveAuthState={effectiveAuthState}
						isAuthLoading={isAuthLoading}
						cachedAuthState={cachedAuthState}
						shouldShowSkeleton={shouldShowSkeleton}
						isDropdownOpen={isDropdownOpen}
						setIsDropdownOpen={setIsDropdownOpen}
						logout={logout}
					/>
				</div>
			</nav>
		</header>
	);
}
