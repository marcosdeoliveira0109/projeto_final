import React, { useState, useEffect } from 'react';
import { produtoService } from '../services/produtoService';

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const dados = await produtoService.getAll();
      setProdutos(dados);
    } catch (error: any) {
      console.error('Erro ao carregar produtos', error);
    }
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await produtoService.create({
        codigo,
        descricao,
        preco: Number(preco),
        estoque: Number(estoque)
      });
      setSucesso('Produto cadastrado com sucesso!');
      setCodigo('');
      setDescricao('');
      setPreco('');
      setEstoque('');
      carregarProdutos();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao cadastrar produto.');
    }
  }

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>📦 Gestão de Produtos - MS² Vestuário</h2>

      {erro && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{erro}</div>}
      {sucesso && <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{sucesso}</div>}

      <form onSubmit={handleCadastrar} style={{ display: 'flex', flexDirection: 'column', width: '350px', gap: '12px', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '16px', color: '#334155' }}>Novo Produto / Roupa</h3>
        <input placeholder="Código (Ex: CAM001)" value={codigo} onChange={e => setCodigo(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input placeholder="Descrição (Ex: Camisa Polo Masculina)" value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="number" step="0.01" placeholder="Preço Unitário (R$)" value={preco} onChange={e => setPreco(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="number" placeholder="Quantidade em Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Produto</button>
      </form>

      <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>Catálogo de Produtos</h3>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '700px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {produtos.map((p: any) => (
            <li key={p.id_produtos} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>[{p.codigo}]</strong> {p.descricao}</span>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#475569' }}>
                <span>Preço: <strong>R$ {Number(p.preco).toFixed(2)}</strong></span>
                <span>Estoque: <strong style={{ color: p.estoque > 0 ? '#16a34a' : '#dc2626' }}>{p.estoque} un.</strong></span>
              </div>
            </li>
          ))}
          {produtos.length === 0 && <p style={{ color: '#64748b' }}>Nenhum produto cadastrado.</p>}
        </ul>
      </div>
    </div>
  );
}