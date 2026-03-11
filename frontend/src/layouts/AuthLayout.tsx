import { Outlet } from "react-router-dom";
import "./AuthLayout.css";

export function AuthLayout() {
  return (
    <div className="auth-container m-0">
      <Outlet />
    </div>
  );
}