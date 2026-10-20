import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UsuarioLogado } from '../App';

interface LoginPageProps {
  onLogin: (usuario: UsuarioLogado) => void;
  demoUsers: Array<{
    id: number;
    nome: string;
    email: string;
    senha: string;
    role: UsuarioLogado['role'];
  }>;
}

export function LoginPage({ onLogin, demoUsers }: LoginPageProps) {
  const [email, setEmail] = useState('gerente@ms2.com');
  const [senha, setSenha] = useState('123456');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const usuarioEncontrado = demoUsers.find(
      (usuario) => usuario.email.toLowerCase() === email.toLowerCase() && usuario.senha === senha
    );

    if (!usuarioEncontrado) {
      setErro('Credenciais inválidas. Use um e-mail e senha de teste.');
      return;
    }

    const usuarioLogado: UsuarioLogado = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
      role: usuarioEncontrado.role,
    };

    onLogin(usuarioLogado);
    navigate('/pdv', { replace: true });
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '18px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25)', padding: '30px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>MS² Vestuário</div>
          <div style={{ color: '#475569', marginTop: '8px' }}>Acesso ao sistema de vendas</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {erro && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 12px', borderRadius: '8px', fontSize: '14px' }}>
              {erro}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1e293b' }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px 16px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '16px' }}>
            Entrar
          </button>
        </form>

        <div style={{ marginTop: '22px', padding: '12px 14px', background: '#eff6ff', borderRadius: '10px', color: '#1e3a8a', fontSize: '13px' }}>
          <strong>Usuários de teste:</strong>
          <div style={{ marginTop: '8px' }}>gerente@ms2.com / 123456</div>
          <div>vendedor@ms2.com / 123456</div>
          <div>funcionario@ms2.com / 123456</div>
        </div>
      </div>
    </div>
  );
}