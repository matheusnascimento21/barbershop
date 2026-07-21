import { useState } from 'react';
import '../index.css';

export default function Login({ setView }) {
  const [loginForm, setLoginForm] = useState({ usuario: '', senha: '' });

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.usuario === 'admin' && loginForm.senha === 'admin') {
      setView('admin'); 
    } else {
      alert("Credenciais inválidas.");
    }
  };

  const inputStyle = {
    width: '100%', padding: '20px', marginBottom: '20px', 
    borderRadius: '8px', border: '1px solid #444', 
    backgroundColor: '#1A1A1A', color: 'var(--text-light)', 
    fontSize: '1.2rem', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#1A1A1A', padding: '60px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 40px rgba(218, 165, 32, 0.15)' }}>
        <h2 style={{ color: 'var(--gold)', textAlign: 'center', marginBottom: '10px', fontSize: '2.5rem' }}>Acesso Restrito</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '40px', fontSize: '1.2rem' }}>Área exclusiva do Barbeiro</p>
        
        <form onSubmit={handleLoginSubmit}>
          <input type="text" name="usuario" value={loginForm.usuario} onChange={handleLoginChange} placeholder="Usuário" required style={inputStyle} />
          <input type="password" name="senha" value={loginForm.senha} onChange={handleLoginChange} placeholder="Senha" required style={inputStyle} />
          <button type="submit" style={{ width: '100%', padding: '20px', backgroundColor: 'var(--gold)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '1.4rem', cursor: 'pointer', marginBottom: '20px', textTransform: 'uppercase' }}>
            Entrar
          </button>
        </form>
        <button onClick={() => setView('site')} style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}>
          Voltar para o Site
        </button>
      </div>
    </div>
  );
}