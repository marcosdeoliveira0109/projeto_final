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
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  function limparFormulario() {
    setCodigo('');
    setDescricao('');
    setPreco('');
    setEstoque('');
    setEditandoId(null);
  }

  async function carregarProdutos() {
    try {
      const dados = await produtoService.getAll();
      setProdutos(dados);
    } catch (error: any) {
      console.error('Erro ao carregar produtos', error);
    }
  }

  function preencherFormulario(produto: any) {
    setCodigo(produto.codigo || '');
    setDescricao(produto.descricao || '');
    setPreco(String(produto.preco ?? ''));
    setEstoque(String(produto.estoque ?? ''));
    setEditandoId(Number(produto.id_produtos ?? produto.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      const dadosProduto = {
        codigo,
        descricao,
        preco: Number(preco),
        estoque: Number(estoque),
      };

      if (editandoId) {
        await produtoService.update(editandoId, dadosProduto);
        setSucesso('Produto atualizado com sucesso!');
      } else {
        await produtoService.create(dadosProduto);
        setSucesso('Produto cadastrado com sucesso!');
      }

      limparFormulario();
      await carregarProdutos();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar produto.');
    }
  }

  return (
    <div>
      <h2 style={{ color: '#c7fce0', marginBottom: '20px', textShadow: '0 0 10px rgba(113,255,175,0.35)' }}>📦 Gestão de Produtos - MS² Vestuário</h2>

      {erro && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{erro}</div>}
      {sucesso && <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{sucesso}</div>}

      <form onSubmit={handleCadastrar} style={{ display: 'flex', flexDirection: 'column', width: '350px', gap: '12px', marginBottom: '30px', background: 'rgba(12, 34, 28, 0.9)', padding: '20px', borderRadius: '12px', boxShadow: '0 0 18px rgba(57, 228, 146, 0.14)', border: '1px solid rgba(134,255,194,0.18)' }}>
        <h3 style={{ fontSize: '16px', color: '#dfffea' }}>{editandoId ? 'Atualizar Produto' : 'Novo Produto / Roupa'}</h3>
        <input placeholder="Código (Ex: CAM001)" value={codigo} onChange={e => setCodigo(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />
        <input placeholder="Descrição (Ex: Camisa Polo Masculina)" value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />
        <input type="number" step="0.01" placeholder="Preço Unitário (R$)" value={preco} onChange={e => setPreco(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />
        <input type="number" placeholder="Quantidade em Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #0f5a3f 0%, #35d58b 50%, #7ef5b0 100%)', color: '#04150f', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 16px rgba(61, 221, 129, 0.4)' }}>
            {editandoId ? 'Atualizar' : 'Salvar Produto'}
          </button>
          {editandoId && (
            <button type="button" onClick={limparFormulario} style={{ padding: '10px 12px', background: 'transparent', color: '#dfffea', border: '1px solid rgba(138,255,196,0.25)', borderRadius: '8px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 style={{ color: '#dfffea', marginBottom: '15px' }}>Catálogo de Produtos</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', maxWidth: '900px' }}>
        {produtos.map((p: any) => {
          const idProduto = Number(p.id_produtos ?? p.id);
          return (
            <div key={idProduto} style={{ background: 'rgba(12, 34, 28, 0.9)', border: '1px solid rgba(134,255,194,0.15)', borderRadius: '14px', padding: '16px', boxShadow: '0 0 18px rgba(57, 228, 146, 0.12)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#9fe8c9', background: 'rgba(42, 94, 71, 0.7)', borderRadius: '999px', padding: '4px 10px' }}>
                  ID: {idProduto}
                </span>
                <button type="button" onClick={() => preencherFormulario(p)} style={{ background: 'transparent', color: '#aafac8', border: '1px solid rgba(138,255,196,0.3)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}>
                  Editar
                </button>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#9fe8c9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Código</div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: '#f0fff7' }}>{p.codigo}</div>
              </div>

              <div style={{ color: '#dfffea' }}>
                <strong>Descrição:</strong> {p.descricao}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', color: '#dfffea' }}>
                <span>Preço: <strong style={{ color: '#aafac8' }}>R$ {Number(p.preco).toFixed(2)}</strong></span>
                <span>Estoque: <strong style={{ color: Number(p.estoque) > 0 ? '#aafac8' : '#ffb4b4' }}>{p.estoque} un.</strong></span>
              </div>
            </div>
          );
        })}

        {produtos.length === 0 && (
          <div style={{ background: 'rgba(12, 34, 28, 0.9)', border: '1px solid rgba(134,255,194,0.15)', borderRadius: '12px', padding: '20px', color: '#dfffea' }}>
            Nenhum produto cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}