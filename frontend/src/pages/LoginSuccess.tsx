import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Salva o JWT no localStorage
      localStorage.setItem("authToken", token);
      console.log("Token capturado com sucesso!");
      
      // Redireciona para a página principal
      navigate("/dashboard");
    } else {
      console.error("Token não encontrado na URL");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <h2>Autenticando... Por favor, aguarde.</h2>
    </div>
  );
}