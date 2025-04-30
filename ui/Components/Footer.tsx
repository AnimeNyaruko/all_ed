"use client";
import Image from "next/image";
import LogoPTNK from "@/public/Logo-PTNK-01-xan.webp";
import LogoTranPhu from "@/public/logo_thpt_tran_phu.webp";
import icon from "@/public/pageIcon.svg";
import VietNamflag from "@/public/VietNamflag.svg";
import { useState, useEffect } from "react";

export default function Footer() {
	const [currentYear, setCurrentYear] = useState<number>(
		new Date().getFullYear(),
	);

	useEffect(() => {
		setCurrentYear(new Date().getFullYear());
	}, []);

	return (
		<footer className="bg-gray-100 py-12" id="footer">
			<div className="px-6 container mx-auto">
				{/* Nội dung kỷ niệm */}
				<div className="mb-8 space-x-4 flex items-center justify-center">
					{/* Icon lá cờ bên trái */}
					<div className="h-16 w-16 p-0.5 border-yellow-400 flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border bg-[#e21c22]">
						<Image
							src={VietNamflag}
							alt="Lá cờ Việt Nam"
							width={70}
							height={70}
							className="object-cover"
						/>
					</div>
					{/* Khối nội dung chữ */}
					<div className="p-3 font-bold text-lg rounded-lg border-yellow-400 flex h-full items-center border bg-[#e21c22] text-center text-[#ffff00]">
						<div>
							<p>
								Chào mừng kỷ niệm 50 năm Ngày Giải phóng miền Nam, thống nhất
								đất nước
							</p>
							<p>30/4/1975 - 30/4/2025</p>
						</div>
					</div>
					{/* Icon lá cờ bên phải */}
					<div className="h-16 w-16 p-0.5 border-yellow-400 flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border bg-[#e21c22]">
						<Image
							src={VietNamflag}
							alt="Lá cờ Việt Nam"
							width={70}
							height={70}
							className="object-cover"
						/>
					</div>
				</div>

				<div className="md:grid-cols-3 gap-8 grid grid-cols-1">
					{/* Logo và Mô tả */}
					<div className="space-y-4">
						<div className="space-x-2 flex items-center justify-center">
							<Image
								src={icon}
								alt="Trường 1 Logo"
								width={100}
								height={50}
								className="object-contain"
							/>
							<Image
								src={LogoPTNK}
								alt="Trường 1 Logo"
								width={100}
								height={50}
								className="object-contain"
							/>
							<Image
								src={LogoTranPhu}
								alt="Trường 2 Logo"
								width={100}
								height={50}
								className="object-contain"
							/>
						</div>
						<p className="text-gray-500">
							Nền tảng học tập trực tuyến chất lượng cao, kết nối học viên và
							giảng viên.
						</p>
					</div>

					{/* Thông tin liên hệ */}
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Liên hệ
						</h3>
						<ul className="space-y-2 text-gray-500">
							<li>Email: thealled03@gmail.com</li>
							<li>Điện thoại: (84) 969-778-638 (Quốc Sang)</li>
							<li>Điện thoại: (84) 905-675-590 (Pí Diệu)</li>
						</ul>
					</div>

					{/* Tác giả */}
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Tác giả
						</h3>
						<div className="space-y-2">
							<a
								href="https://facebook.com/truong.quoc.sang.636253"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:text-blue-800 block"
							>
								Trương Quốc Sang - THPT Trần Phú
							</a>
							<a
								href="https://facebook.com/sampidieu"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:text-blue-800 block"
							>
								Sẩm Pí Diệu - Phổ thông Năng khiếu, ĐHQG-HCM
							</a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-gray-300 mt-8 pt-4 text-gray-500 border-t text-center">
					<p>&copy; {currentYear} AllEd. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
