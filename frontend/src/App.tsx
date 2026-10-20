import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { PDVPage } from './pages/PDVPage';
import { ClientesPage } from './pages/ClientesPage';
import { ProdutosPage } from './pages/ProdutosPage';
import { VendasPage } from './pages/VendasPage';

export type PerfilUsuario = 'gerente' | 'funcionario' | 'vendedor';

export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  role: PerfilUsuario;
};

export const DEMO_USERS = [
  { id: 1, nome: 'Marcos Oliveira', email: 'gerente@ms2.com', senha: '123456', role: 'gerente' as const },
  { id: 2, nome: 'Ana Souza', email: 'vendedor@ms2.com', senha: '123456', role: 'vendedor' as const },
  { id: 3, nome: 'Bruno Costa', email: 'funcionario@ms2.com', senha: '123456', role: 'funcionario' as const },
];

const STORAGE_KEY = 'ms2_usuario_logado';

function getUsuarioSalvo(): UsuarioLogado | null {
  try {
    const usuario = localStorage.getItem(STORAGE_KEY);
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
}

function ProtectedLayout({
  usuario,
  onLogout,
}: {
  usuario: UsuarioLogado | null;
  onLogout: () => void;
}) {
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', background: 'radial-gradient(circle at top, #123e2d 0%, #071b17 35%, #030d0b 100%)', color: '#ecfff7' }}>
      <nav style={{ width: '230px', background: 'linear-gradient(180deg, rgba(7,26,21,0.96) 0%, rgba(6,18,15,0.98) 100%)', borderRight: '1px solid rgba(109,255,180,0.25)', boxShadow: '0 0 26px rgba(50, 240, 146, 0.12)', color: '#fff', padding: '24px 20px', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '30px', color: '#9ff7c6', textShadow: '0 0 12px rgba(113, 255, 175, 0.7)' }}>MS² Vestuário</h2>

        <div style={{ marginBottom: '24px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(17, 62, 47, 0.9)', border: '1px solid rgba(144, 255, 196, 0.25)', boxShadow: '0 0 18px rgba(54, 230, 146, 0.16)' }}>
          <div style={{ fontSize: '12px', color: '#9fe8c9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Usuário</div>
          <div style={{ fontWeight: 700, marginTop: '4px', color: '#f0fff6' }}>{usuario.nome}</div>
          <div style={{ fontSize: '12px', color: '#d9ffe8', marginTop: '2px' }}>ID: {usuario.id}</div>
          <div style={{ fontSize: '12px', color: '#d9ffe8', marginTop: '2px' }}>{usuario.role}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/pdv" style={{ color: '#eafef4', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: '8px', background: 'rgba(18, 56, 44, 0.45)' }}>🛒 Caixa / PDV</Link></li>
            <li><Link to="/clientes" style={{ color: '#eafef4', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: '8px', background: 'rgba(18, 56, 44, 0.45)' }}>👥 Clientes</Link></li>
            <li><Link to="/produtos" style={{ color: '#eafef4', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: '8px', background: 'rgba(18, 56, 44, 0.45)' }}>📦 Produtos</Link></li>
            {usuario.role === 'gerente' && (
              <li><Link to="/vendas" style={{ color: '#eafef4', textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: '8px', background: 'rgba(18, 56, 44, 0.45)' }}>📜 Vendas</Link></li>
            )}
          </ul>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', borderTop: '1px solid rgba(109,255,180,0.2)' }}>
            <Link to="/" style={{ color: '#aafac8', textDecoration: 'none', display: 'block', padding: '10px 12px', borderRadius: '8px', background: 'rgba(18, 56, 44, 0.45)', textAlign: 'center', fontWeight: 700 }}>
              🔑 Login
            </Link>
            <button
              type="button"
              onClick={onLogout}
              style={{ background: 'rgba(255, 177, 177, 0.08)', border: '1px solid rgba(255, 177, 177, 0.25)', color: '#ffb1b1', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 700 }}
            >
              🔒 Sair
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, background: 'rgba(9, 20, 17, 0.28)', padding: '30px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(() => getUsuarioSalvo());

  const handleLogin = (novoUsuario: UsuarioLogado) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novoUsuario));
    setUsuario(novoUsuario);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={usuario ? <Navigate to="/pdv" replace /> : <LoginPage onLogin={handleLogin} demoUsers={DEMO_USERS} />}
        />

        <Route element={<ProtectedLayout usuario={usuario} onLogout={handleLogout} />}>
          <Route path="/pdv" element={<PDVPage usuario={usuario!} />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/vendas" element={usuario?.role === 'gerente' ? <VendasPage usuario={usuario} /> : <Navigate to="/pdv" replace />} />
        </Route>

        <Route path="*" element={<Navigate to={usuario ? '/pdv' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;