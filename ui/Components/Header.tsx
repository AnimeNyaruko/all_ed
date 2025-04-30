"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-md shadow-lg z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The AllEd
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Trang chủ</Link>
            <Link href="/create" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Tạo bài tập</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Về chúng tôi</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Liên hệ</Link>
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium shadow-md">
              Đăng nhập
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}