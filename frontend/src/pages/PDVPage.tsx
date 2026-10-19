import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { clienteService } from '../services/clienteService';

export function PDVPage() {
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [desconto, setDesconto] = useState(0);
  const [usuarioId, setUsuarioId] = useState(1);
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    carregarClientes();
  }, []);

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
        itens: [
          { produto_id: Number(produtoId), quantidade: Number(quantidade) }
        ]
      };

      const response = await api.post('/vendas', payload);
      alert(`Venda realizada com sucesso! ID: ${response.data.id} | Total: R$ ${response.data.valor_total}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao processar a venda.');
    }
  }

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Frente de Caixa (PDV)</h2>
      <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
        <form onSubmit={handleFinalizarVenda} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>ID do Operador / Caixa:</label>
            <input type="number" value={usuarioId} onChange={e => setUsuarioId(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Cliente:</label>
            <select
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
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
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>ID do Produto:</label>
            <input type="number" value={produtoId} onChange={e => setProdutoId(e.target.value)} placeholder="Ex: 1" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Quantidade:</label>
            <input type="number" value={quantidade} onChange={e => setQuantidade(Number(e.target.value))} min={1} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Desconto (R$):</label>
            <input type="number" value={desconto} onChange={e => setDesconto(Number(e.target.value))} min={0} step="0.01" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>
          <button type="submit" style={{ padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Finalizar Venda</button>
        </form>
      </div>
    </div>
  );
}