import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { LoginSuccess } from "./pages/Login/LoginSuccess";
import { Feed } from "./pages/Feed";
// import { PrivateRoute } from "./components/PrivateRoute";
import { AuthLayout } from "./layouts/AuthLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />
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
  );
}

export default App;