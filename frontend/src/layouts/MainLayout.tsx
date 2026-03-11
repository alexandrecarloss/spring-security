// import { Outlet, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
// import { userService } from "../services/userService";

export function MainLayout() {
  // const user = userService.getUserData();

  // if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-0 mt-14">
        <Outlet />
      </main>
    </div>
  );
}