import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { resetPasswordRequest } from "../services/authService";
import { Lock, Eye } from "@boxicons/react";
import type { AxiosError } from "axios";
import "./ResetPassword.css";

type CSSVars = React.CSSProperties & {
  "--i"?: number;
  "--j"?: number;
};

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showToast("Token de recuperação ausente!", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("As senhas não coincidem", "error");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordRequest(token, newPassword);

      showToast("Senha alterada com sucesso!", "success");
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showToast(
        error.response?.data?.message || "Erro ao redefinir senha.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper" style={{ height: "auto", minHeight: "400px" }}>
      <span
        className="bg-animated"
        style={{ transform: "none", transition: "none" }}
      ></span>

      {/* Removendo a classe 'login' ou garantindo que ela seja visível */}
      <div
        className="form-box"
        style={{
          position: "relative",
          width: "100%",
          padding: "40px",
          display: "flex",
          opacity: 1,
          pointerEvents: "auto",
        }}
      >
        <h2
          className="animation"
          style={
            { "--i": 0, "--j": 0, transform: "none", opacity: 1 } as CSSVars
          }
        >
          Nova Senha
        </h2>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div
            className="input-box animation"
            style={
              { "--i": 1, "--j": 1, transform: "none", opacity: 1 } as CSSVars
            }
          >
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder=" "
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Digite a nova senha</label>
            <div
              className="icon-eye"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <Lock /> : <Eye />}
            </div>
          </div>

          <div
            className="input-box animation"
            style={
              { "--i": 2, "--j": 2, transform: "none", opacity: 1 } as CSSVars
            }
          >
            <input
              type={showPasswordConfirm ? "text" : "password"}
              required
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label>Confirme a nova senha</label>
            <div
              className="icon-eye"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              style={{ cursor: "pointer" }}
            >
              {showPasswordConfirm ? <Lock /> : <Eye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn animation ${loading ? "loading" : ""}`}
            style={
              { "--i": 3, "--j": 3, transform: "none", opacity: 1 } as CSSVars
            }
          >
            {loading ? "Processando..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
