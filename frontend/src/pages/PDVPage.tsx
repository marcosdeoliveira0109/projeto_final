import React, { useEffect, useState } from 'react';
import type { UsuarioLogado } from '../App';
import { api } from '../services/api';
import { clienteService } from '../services/clienteService';

interface PDVPageProps {
  usuario: UsuarioLogado;
}

type VendaHistorico = {
  id: number | string;
  status: 'concluida' | 'cancelada';
  valor_total: number;
  descoto: number;
  clientes_id_clientes: number;
  usuarios_id_Usuarios: number;
  itens: Array<{ produto_id: number; quantidade: number }>;
  criado_em?: string;
  cancelada_por?: string;
  cancelada_em?: string;
};

const HISTORICO_VENDAS_KEY = 'ms2_historico_vendas';

export function PDVPage({ usuario }: PDVPageProps) {
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [desconto, setDesconto] = useState(0);
  const [usuarioId, setUsuarioId] = useState(usuario.id);
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    carregarClientes();
  }, []);

  function salvarVendaNoHistorico(venda: VendaHistorico) {
    const vendas = JSON.parse(localStorage.getItem(HISTORICO_VENDAS_KEY) || '[]');
    vendas.unshift(venda);
    localStorage.setItem(HISTORICO_VENDAS_KEY, JSON.stringify(vendas));
  }

  async function carregarClientes() {
    try {
      const clientes = await clienteService.getAll();
      setClientes(clientes);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao carregar clientes.');
    }
  }

  async function handleFinalizarVenda(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        usuarios_id_Usuarios: Number(usuarioId),
        clientes_id_clientes: Number(clienteId),
        descoto: Number(desconto),
        itens: [{ produto_id: Number(produtoId), quantidade: Number(quantidade) }],
      };

      const response = await api.post('/vendas', payload);

      const vendaRegistrada: VendaHistorico = {
        id: response.data.id ?? Date.now(),
        status: 'concluida',
        valor_total: Number(response.data.valor_total),
        descoto: Number(desconto),
        clientes_id_clientes: Number(clienteId),
        usuarios_id_Usuarios: Number(usuarioId),
        itens: payload.itens,
        criado_em: new Date().toISOString(),
      };

      salvarVendaNoHistorico(vendaRegistrada);
      alert(`Venda realizada com sucesso! ID: ${response.data.id} | Total: R$ ${response.data.valor_total}`);
      setClienteId('');
      setProdutoId('');
      setQuantidade(1);
      setDesconto(0);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao processar a venda.');
    }
  }

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>Frente de Caixa (PDV)</h2>
      <p style={{ color: '#475569', marginBottom: '20px' }}>Operador: <strong>{usuario.nome}</strong> · {usuario.role}</p>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(15, 23, 42, 0.08)', maxWidth: '520px' }}>
        <form onSubmit={handleFinalizarVenda} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#334155' }}>ID do Operador / Caixa:</label>
            <input
              type="number"
              value={usuarioId}
              onChange={(e) => setUsuarioId(Number(e.target.value))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#334155' }}>Cliente:</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente: any) => (
                <option key={cliente.id ?? cliente.id_clientes} value={cliente.id ?? cliente.id_clientes}>
                  {cliente.nome || `Cliente ${cliente.id ?? cliente.id_clientes}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#334155' }}>ID do Produto:</label>
            <input
              type="number"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              placeholder="Ex: 1"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#334155' }}>Quantidade:</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min={1}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#334155' }}>Desconto (R$):</label>
            <input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
              min={0}
              step="0.01"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ padding: '12px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            Finalizar Venda
          </button>
        </form>
      </div>
    </div>
  );
}