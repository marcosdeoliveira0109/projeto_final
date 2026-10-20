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
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [estoqueMensagem, setEstoqueMensagem] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  useEffect(() => {
    const produtoValido = Number(produtoId);
    if (!produtoId || Number.isNaN(produtoValido)) {
      setProdutoSelecionado(null);
      setEstoqueMensagem('');
      return;
    }

    let ativo = true;

    api.get(`/produtos/${produtoValido}`)
      .then((response) => {
        if (!ativo) return;
        setProdutoSelecionado(response.data);
      })
      .catch(() => {
        if (!ativo) return;
        setProdutoSelecionado(null);
      });

    return () => {
      ativo = false;
    };
  }, [produtoId]);

  useEffect(() => {
    if (!produtoSelecionado) {
      setEstoqueMensagem('');
      return;
    }

    const estoqueAtual = Number(produtoSelecionado.estoque || 0);
    const quantidadeSolicitada = Number(quantidade || 0);

    if (quantidadeSolicitada > 0 && quantidadeSolicitada > estoqueAtual) {
      const faltam = quantidadeSolicitada - estoqueAtual;
      setEstoqueMensagem(`❌ Estoque insuficiente. Faltam ${faltam} unidade(s) para completar esta venda.`);
      return;
    }

    if (estoqueAtual <= 5) {
      setEstoqueMensagem(`⚠️ Atenção: estoque baixo. Restam apenas ${estoqueAtual} unidade(s) deste produto.`);
      return;
    }

    setEstoqueMensagem('');
  }, [produtoSelecionado, quantidade]);

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

    if (produtoSelecionado) {
      const estoqueAtual = Number(produtoSelecionado.estoque || 0);
      const quantidadeSolicitada = Number(quantidade || 0);

      if (quantidadeSolicitada > estoqueAtual) {
        const faltam = quantidadeSolicitada - estoqueAtual;
        alert(`Estoque insuficiente. Faltam ${faltam} unidade(s) para completar esta venda.`);
        return;
      }
    }

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
      <h2 style={{ color: '#c7fce0', marginBottom: '10px', textShadow: '0 0 10px rgba(113,255,175,0.35)' }}>Frente de Caixa (PDV)</h2>
      <p style={{ color: '#dfffea', marginBottom: '20px' }}>Operador: <strong>{usuario.nome}</strong> · {usuario.role}</p>

      <div style={{ background: 'rgba(12, 34, 28, 0.9)', border: '1px solid rgba(134,255,194,0.15)', padding: '25px', borderRadius: '12px', boxShadow: '0 0 18px rgba(57, 228, 146, 0.12)', maxWidth: '520px' }}>
        <form onSubmit={handleFinalizarVenda} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#dfffea' }}>ID do Operador / Caixa:</label>
            <input
              type="number"
              value={usuarioId}
              onChange={(e) => setUsuarioId(Number(e.target.value))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#dfffea' }}>Cliente:</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7', boxSizing: 'border-box' }}
              required
            >
              <option value="" style={{ background: '#020b09', color: '#f0fff7' }}>Selecione um cliente</option>
              {clientes.map((cliente: any) => (
                <option key={cliente.id ?? cliente.id_clientes} value={cliente.id ?? cliente.id_clientes} style={{ background: '#020b09', color: '#f0fff7' }}>
                  {cliente.nome || `Cliente ${cliente.id ?? cliente.id_clientes}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#dfffea' }}>ID do Produto:</label>
            <input
              type="number"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              placeholder="Ex: 1"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#dfffea' }}>Quantidade:</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min={1}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7', boxSizing: 'border-box' }}
              required
            />
          </div>

          {estoqueMensagem && (
            <div style={{ background: estoqueMensagem.includes('❌') ? 'rgba(127, 29, 29, 0.55)' : 'rgba(122, 92, 17, 0.45)', border: '1px solid rgba(138,255,196,0.2)', color: '#f0fff7', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' }}>
              {estoqueMensagem}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#dfffea' }}>Desconto (R$):</label>
            <input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
              min={0}
              step="0.01"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #0f5a3f 0%, #35d58b 50%, #7ef5b0 100%)', color: '#04150f', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 0 18px rgba(73, 237, 145, 0.38)' }}>
            Finalizar Venda
          </button>
        </form>
      </div>
    </div>
  );
}