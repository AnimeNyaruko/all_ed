"use client";
import { createContext, useContext, ReactNode } from "react";
import { toast, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning" | "loading";

type ToastContextType = {
  showToast: (message: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastConfig: ToastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const showToast = (message: string, type: ToastType) => {
    switch (type) {
      case "success":
        toast.success(message, toastConfig);
        break;
      case "error":
        toast.error(message, toastConfig);
        break;
      case "info":
        toast.info(message, toastConfig);
        break;
      case "warning":
        toast.warning(message, toastConfig);
        break;
      case "loading":
        toast.loading(message, toastConfig);
        break;
      default:
        toast(message, toastConfig);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
} 