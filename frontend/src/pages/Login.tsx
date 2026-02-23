export function Login() {
  const handleGoogleLogin = () => {
    // O Spring Security espera que iniciemos o fluxo nesta rota padrão
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Bem-vindo</h1>
        <p>Faça login para acessar o feed</p>
        
        <button onClick={handleGoogleLogin} style={styles.button}>
          <img 
            src="https://authjs.dev/img/providers/google.svg" 
            alt="Google logo" 
            style={styles.icon} 
          />
          Entrar com Google
        </button>

        <div style={styles.divider}>ou</div>

        {/* Espaço para o seu formulário de login tradicional (E-mail/Senha) futuro */}
        <input type="email" placeholder="E-mail" style={styles.input} disabled />
        <input type="password" placeholder="Senha" style={styles.input} disabled />
        <button style={{...styles.button, backgroundColor: '#ccc'}} disabled>
          Entrar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' as const, width: '350px' },
  button: { 
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '10px', 
    marginTop: '20px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd', 
    backgroundColor: '#fff', fontSize: '16px', fontWeight: '500' 
  },
  icon: { width: '20px', marginRight: '10px' },
  input: { width: '100%', padding: '10px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' as const },
  divider: { margin: '20px 0', color: '#888', fontSize: '14px' }
};