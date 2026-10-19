import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { PDVPage } from './pages/PDVPage';
import { ClientesPage } from './pages/ClientesPage';
import { ProdutosPage } from './pages/ProdutosPage';

export function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        {/* Menu lateral de navegação */}
        <nav style={{ width: '220px', backgroundColor: '#1e293b', color: '#fff', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '30px', color: '#38bdf8' }}>MS² Vestuário</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li><Link to="/pdv" style={{ color: '#cbd5e1', textDecoration: 'none' }}>🛒 Caixa / PDV</Link></li>
            <li><Link to="/clientes" style={{ color: '#cbd5e1', textDecoration: 'none' }}>👥 Clientes</Link></li>
            <li><Link to="/produtos" style={{ color: '#cbd5e1', textDecoration: 'none' }}>📦 Produtos</Link></li>
            <li><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>🔒 Sair / Login</Link></li>
          </ul>
        </nav>

        {/* Conteúdo Principal */}
        <main style={{ flex: 1, backgroundColor: '#f8fafc', padding: '30px' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/pdv" element={<PDVPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;