import React, { useState, useCallback, type ReactNode } from "react";
import { ToastContext } from "./ToastContext"; // Importa o contexto do arquivo acima

type ToastType = "success" | "error";

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: toast.type === "success" ? "var(--secondary-color)" : "var(--alert-color)",
            color: "var(--main-color)",
            padding: "12px 20px",
            borderRadius: 6,
            fontWeight: "bold",
            zIndex: 10000,
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};