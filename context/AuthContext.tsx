"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { checkCookie, deleteCookie } from "@/utils/cookie";
import { signOut } from "next-auth/react";

type AuthContextType = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'AUTH_STATE';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Khởi tạo state từ sessionStorage nếu có (giảm flicker khi F5)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const refreshAuthState = async () => {
    setIsAuthLoading(true);
    try {
      const hasSessionCookie = await checkCookie("session");
      setIsLoggedIn(hasSessionCookie);
      
      // Lưu trạng thái vào sessionStorage để sử dụng khi tải lại trang
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(hasSessionCookie));
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  const logout = async () => {
    await deleteCookie("session");
    await deleteCookie("assignment_id");
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };
  
  useEffect(() => {
    refreshAuthState();
  }, []);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthLoading, logout, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 