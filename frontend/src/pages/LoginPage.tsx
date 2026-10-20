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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'radial-gradient(circle at top, #123d2c 0%, #09251d 30%, #05140f 100%)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(7, 23, 18, 0.82)', border: '1px solid rgba(120, 255, 185, 0.28)', borderRadius: '18px', boxShadow: '0 0 30px rgba(49, 214, 121, 0.25), 0 20px 45px rgba(4, 12, 9, 0.55)', padding: '30px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#aafac8', textShadow: '0 0 14px rgba(80, 255, 154, 0.7)' }}>MS² Vestuário</div>
          <div style={{ color: '#d7fce6', marginTop: '8px' }}>Acesso ao sistema de vendas</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {erro && (
            <div style={{ background: '#3d1717', color: '#ffb4b4', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(255, 122, 122, 0.35)' }}>
              {erro}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#dfffea' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#0d1d18', color: '#f4fff9', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#dfffea' }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#0d1d18', color: '#f4fff9', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px 16px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #0f5a3f 0%, #35d58b 50%, #7ef5b0 100%)', color: '#04150f', cursor: 'pointer', fontWeight: 800, fontSize: '16px', boxShadow: '0 0 18px rgba(73, 237, 145, 0.45)' }}>
            Entrar
          </button>
        </form>

        <div style={{ marginTop: '22px', padding: '12px 14px', background: 'rgba(32, 84, 64, 0.45)', borderRadius: '10px', color: '#ebfff4', fontSize: '13px', border: '1px solid rgba(144,255,196,0.2)' }}>
          <strong>Usuários de teste:</strong>
          <div style={{ marginTop: '8px' }}>gerente@ms2.com / 123456</div>
          <div>vendedor@ms2.com / 123456</div>
          <div>funcionario@ms2.com / 123456</div>
        </div>
      </div>
    </div>
  );
}