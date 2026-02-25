import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { LoginSuccess } from './pages/LoginSuccess';
import { AuthLayout } from "./layouts/AuthLayout";


function App() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />
        </Route>
        
        {/* Rota protegida temporária (Dashboard) */}
        <Route path="/dashboard" element={
          <div style={{ padding: '20px' }}>
            <h1>🎉 Logado com Sucesso!</h1>
            <p>Seu token JWT já está no LocalStorage.</p>
            <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Sair</button>
          </div>
        } />

        {/* Redireciona qualquer rota desconhecida para o login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;