"use client";
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AppShell({ children }: { children: ReactNode }) {
  const { isAuthLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Chỉ hiển thị nội dung sau khi quá trình xác thực hoàn tất
  // và thêm một khoảng thời gian nhỏ để đảm bảo rendering
  useEffect(() => {
    if (!isAuthLoading) {
      // Đã hoàn thành quá trình xác thực, cho phép render
      setIsReady(true);
    }
  }, [isAuthLoading]);

  // Trả về div trống cùng kích thước để tránh layout shift
  if (!isReady) {
    return <div className="min-h-screen" />;
  }

  return <>{children}</>;
} 