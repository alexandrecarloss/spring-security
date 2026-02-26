import { useState } from "react";
import "./Login.css";
import { loginRequest, registerRequest } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

type CSSVars = React.CSSProperties & {
  "--i"?: number;
  "--j"?: number;
};

import { Envelope, Lock, Eye, User, CheckShield } from "@boxicons/react";
import type { AxiosError } from "axios";

export function Login() {
  const [isActive, setIsActive] = useState(false); // Troca entre Login e Register
  const [showForgot, setShowForgot] = useState(false); // Mostra esqueci a senha
  const [showSuccess, setShowSuccess] = useState(false); // Mostra mensagem de sucesso
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Função para iniciar o Login com Google (Integração com seu Backend)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await loginRequest(email, password);

      localStorage.setItem("authToken", data.accessToken);

      navigate("/feed");
    } catch (error) {
      showToast("Credenciais inválidas", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      await registerRequest(fullName, email, password);

      showToast("Conta criada com sucesso!", "success");
      setIsActive(false);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Erro desconhecido";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`wrapper ${isActive ? "active" : ""} ${
        showForgot ? "show-forgot" : ""
      } ${showSuccess ? "show-success" : ""}`}
    >
      <span className="bg-animated"></span>
      <span className="bg-animated2"></span>

      {/* BOX LOGIN */}
      <div className="form-box login">
        <h2 className="animation" style={{ "--i": 0, "--j": 21 } as CSSVars}>
          Login
        </h2>

        <div
          className="social-media animation"
          style={{ "--i": 0.5, "--j": 21.5 } as CSSVars}
        >
          <button onClick={handleGoogleLogin} className="google-btn-custom">
            <i className="bx bxl-google"></i> Entrar com Google
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div
            className="input-box animation"
            style={{ "--i": 1, "--j": 22 } as CSSVars}
          >
            <input
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>E-mail</label>
            <Envelope />
          </div>

          <div
            className="input-box animation"
            style={{ "--i": 2, "--j": 23 } as CSSVars}
          >
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            {showPassword ? (
              <Lock onClick={() => setShowPassword(false)} />
            ) : (
              <Eye onClick={() => setShowPassword(true)} />
            )}
          </div>

          <div
            className="forgot-link animation"
            style={{ "--i": 2.5, "--j": 23.5 } as CSSVars}
          >
            <a href="#" onClick={() => setShowForgot(true)}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className={`btn animation ${loading ? "loading" : ""}`}
            style={{ "--i": 3, "--j": 24 } as CSSVars}
          >
            Login
          </button>

          <div
            className="logreg-link animation"
            style={{ "--i": 4, "--j": 25 } as CSSVars}
          >
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={() => setIsActive(true)}>
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
      <div className="info-text login">
        <h2 className="animation" style={{ "--i": 0, "--j": 20 } as CSSVars}>
          Welcome back!
        </h2>
        <p className="animation" style={{ "--i": 1, "--j": 21 } as CSSVars}>
          Hello! It's great to see you here.
        </p>
      </div>

      {/* BOX REGISTER */}
      <div className="form-box register">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 } as CSSVars}>
          Sign Up
        </h2>
        <div
          className="social-media animation"
          style={{ "--i": 17.5, "--j": 0.5 } as CSSVars}
        >
          <button onClick={handleGoogleLogin} className="google-btn-custom">
            <i className="bx bxl-google"></i> Criar com Google
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div
            className="input-box animation"
            style={{ "--i": 18, "--j": 1 } as CSSVars}
          >
            <input
              type="text"
              required
              placeholder=" "
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label>Name</label>
            <User />
          </div>
          <div
            className="input-box animation"
            style={{ "--i": 19, "--j": 2 } as CSSVars}
          >
            <input type="email" 
            required 
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
            <label>E-mail</label>
            <Envelope />
          </div>
          <div
            className="input-box animation"
            style={{ "--i": 20, "--j": 3 } as CSSVars}
          >
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            {showPassword ? (
              <Lock onClick={() => setShowPassword(false)} />
            ) : (
              <Eye onClick={() => setShowPassword(true)} />
            )}
          </div>
          <button
            type="submit"
            className="btn animation"
            style={{ "--i": 21, "--j": 4 } as CSSVars}
          >
            Sign Up
          </button>
          <div
            className="logreg-link animation"
            style={{ "--i": 22, "--j": 5 } as CSSVars}
          >
            <p>
              Already have an account?{" "}
              <a href="#" onClick={() => setIsActive(false)}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
      <div className="info-text register">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 } as CSSVars}>
          Welcome!
        </h2>
        <p className="animation" style={{ "--i": 18, "--j": 1 } as CSSVars}>
          Hello! It's great to see you here.
        </p>
      </div>

      {/* BOX FORGOT PASSWORD */}
      <div className="form-box forgot-password">
        <h2 className="animation" style={{ "--i": 0, "--j": 21 } as CSSVars}>
          Reset Password
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuccess(true);
            setShowForgot(false);
          }}
        >
          <p
            className="animation reset-email-text"
            style={{ "--i": 1, "--j": 22 } as CSSVars}
          >
            Enter your email to receive a reset link.
          </p>
          <div
            className="input-box animation"
            style={{ "--i": 2, "--j": 23 } as CSSVars}
          >
            <input type="email" required placeholder=" " />
            <label>E-mail</label>
            <Envelope />
          </div>
          <button
            type="submit"
            className="btn animation"
            style={{ "--i": 3, "--j": 24 } as CSSVars}
          >
            Send Link
          </button>
          <div
            className="logreg-link animation"
            style={{ "--i": 4, "--j": 25 } as CSSVars}
          >
            <p>
              <a href="#" onClick={() => setShowForgot(false)}>
                Back to Login
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* MENSAGEM DE SUCESSO (Oculta por padrão via CSS wrapper.show-success) */}
      <div className="form-box success-message">
        <h2 className="animation" style={{ "--i": 0, "--j": 21 } as CSSVars}>
          Email Sent!
        </h2>
        <CheckShield className="success-icon animation" />
        <p
          className="animation email-sent"
          style={{ "--i": 2, "--j": 23 } as CSSVars}
        >
          We've sent a password reset link to your email. Please check your
          inbox.
        </p>
        <button
          className="btn animation back-to-login"
          onClick={() => setShowSuccess(false)}
          style={{ "--i": 3, "--j": 24 } as CSSVars}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
