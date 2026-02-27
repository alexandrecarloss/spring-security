import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { LoginSuccess } from "./pages/Login/LoginSuccess";
import { Feed } from "./pages/Feed";
import { AuthLayout } from "./layouts/AuthLayout";
import { ToastProvider } from "./context/ToastProvider.tsx";
import './styles/variables.css';
import { ResetPassword } from "./pages/ResetPassword.tsx";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route
              path="/feed"
              element={
                  <Feed />
              }
            />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;