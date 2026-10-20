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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ width: '230px', backgroundColor: '#0f172a', color: '#fff', padding: '24px 20px', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '30px', color: '#7dd3fc' }}>MS² Vestuário</h2>

        <div style={{ marginBottom: '24px', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#1e293b' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Usuário</div>
          <div style={{ fontWeight: 700, marginTop: '4px' }}>{usuario.nome}</div>
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{usuario.role}</div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><Link to="/pdv" style={{ color: '#e2e8f0', textDecoration: 'none' }}>🛒 Caixa / PDV</Link></li>
          <li><Link to="/clientes" style={{ color: '#e2e8f0', textDecoration: 'none' }}>👥 Clientes</Link></li>
          <li><Link to="/produtos" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📦 Produtos</Link></li>
          {usuario.role === 'gerente' && (
            <li><Link to="/vendas" style={{ color: '#e2e8f0', textDecoration: 'none' }}>📜 Vendas</Link></li>
          )}
          <li>
            <button
              type="button"
              onClick={onLogout}
              style={{ background: 'transparent', border: 'none', color: '#fca5a5', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: '15px' }}
            >
              🔒 Sair / Login
            </button>
          </li>
        </ul>
      </nav>

      <main style={{ flex: 1, backgroundColor: '#f8fafc', padding: '30px' }}>
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