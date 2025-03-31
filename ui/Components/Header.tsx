"use client";
import Link from "next/link";

export default function Header() {
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
					<div className="md:flex space-x-8 hidden items-center">
						<Link
							href="/"
							className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
						>
							Trang chủ
						</Link>
						<Link
							href="/create"
							className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
						>
							Tạo bài tập
						</Link>
						<Link
							href="/about"
							className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
						>
							Về chúng tôi
						</Link>
						<Link
							href="/contact"
							className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
						>
							Liên hệ
						</Link>
						<Link
							href="/dangnhap"
							className="from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-md bg-gradient-to-r transition-colors"
						>
							Đăng nhập
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
}
