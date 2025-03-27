"use client";
import Link from "next/link";
import Image from "next/image";
import LogoPTNK from "@/public/Logo-PTNK-01-xan.webp";
import LogoTranPhu from "@/public/logo thpt tran phu.webp";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo và Mô tả */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Image
                src="/logo.png"
                alt="AllEd Logo"
                width={100}
                height={50}
                className="rounded-full"
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
            <p className="text-gray-600">
              Nền tảng học tập trực tuyến chất lượng cao, kết nối học viên và giảng viên.
            </p>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: thealled03@gmail.com</li>
              <li>Điện thoại: (84) 969-778-638 (Quốc Sang)</li>
              <li>Điện thoại: (84) 905-675-590 (Pí Diệu)</li>
            </ul>
          </div>

          {/* Tác giả */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tác giả</h3>
            <div className="space-y-2">
              <a
                href="https://facebook.com/truong.quoc.sang.636253"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800"
              >
                Trương Quốc Sang - THPT Trần Phú
              </a>
              <a
                href="https://facebook.com/sampidieu"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800"
              >
                Sẩm Pí Diệu - Phổ thông Năng khiếu, ĐHQG-HCM
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-4 pt-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} AllEd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
