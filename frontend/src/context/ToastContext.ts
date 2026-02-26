import { createContext, useContext } from "react";

type ToastType = "success" | "error";

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function useToast() {
  return useContext(ToastContext);
}