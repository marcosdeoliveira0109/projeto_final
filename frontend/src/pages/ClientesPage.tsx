import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';

export function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  function limparFormulario() {
    setNome('');
    setCpf('');
    setEmail('');
    setTelefone('');
    setEditandoId(null);
  }

  async function carregarClientes() {
    try {
      const dados = await clienteService.getAll();
      setClientes(dados);
    } catch (error: any) {
      console.error('Erro ao carregar clientes', error);
    }
  }

  function preencherFormulario(cliente: any) {
    setNome(cliente.nome || '');
    setCpf(cliente.cpf || '');
    setEmail(cliente.email || '');
    setTelefone(cliente.telefone || '');
    setEditandoId(Number(cliente.id_clientes ?? cliente.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      const dadosCliente = { nome, cpf, email, telefone };

      if (editandoId) {
        await clienteService.update(editandoId, dadosCliente);
        setSucesso('Cliente atualizado com sucesso!');
      } else {
        await clienteService.create(dadosCliente);
        setSucesso('Cliente cadastrado com sucesso!');
      }

      limparFormulario();
      await carregarClientes();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao salvar cliente.');
    }
  }

  return (
    <div>
      <h2 style={{ color: '#c7fce0', marginBottom: '20px', textShadow: '0 0 10px rgba(113,255,175,0.35)' }}>👥 Gestão de Clientes - MS² Vestuário</h2>

      {erro && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{erro}</div>}
      {sucesso && <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{sucesso}</div>}

      <form onSubmit={handleCadastrar} style={{ display: 'flex', flexDirection: 'column', width: '350px', gap: '12px', marginBottom: '30px', background: 'rgba(12, 34, 28, 0.9)', padding: '20px', borderRadius: '12px', boxShadow: '0 0 18px rgba(57, 228, 146, 0.14)', border: '1px solid rgba(134,255,194,0.18)' }}>
        <h3 style={{ fontSize: '16px', color: '#dfffea' }}>{editandoId ? 'Atualizar Cliente' : 'Novo Cliente'}</h3>
        <input placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />
        <input placeholder="CPF (apenas números ou formatado)" value={cpf} onChange={e => setCpf(e.target.value)} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />
        <input placeholder="Telefone / Telemóvel" value={telefone} onChange={e => setTelefone(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(138, 255, 196, 0.28)', background: '#020b09', color: '#f0fff7' }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #0f5a3f 0%, #35d58b 50%, #7ef5b0 100%)', color: '#04150f', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 16px rgba(61, 221, 129, 0.4)' }}>
            {editandoId ? 'Atualizar' : 'Salvar Cliente'}
          </button>
          {editandoId && (
            <button type="button" onClick={limparFormulario} style={{ padding: '10px 12px', background: 'transparent', color: '#dfffea', border: '1px solid rgba(138,255,196,0.25)', borderRadius: '8px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 style={{ color: '#dfffea', marginBottom: '15px' }}>Lista de Clientes Cadastrados</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '900px' }}>
        {clientes.map((c: any) => {
          const idCliente = Number(c.id_clientes ?? c.id);
          return (
            <div key={idCliente} style={{ background: 'rgba(12, 34, 28, 0.9)', border: '1px solid rgba(134,255,194,0.15)', borderRadius: '14px', padding: '16px', boxShadow: '0 0 18px rgba(57, 228, 146, 0.12)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#9fe8c9', background: 'rgba(42, 94, 71, 0.7)', borderRadius: '999px', padding: '4px 10px' }}>
                  ID: {idCliente}
                </span>
                <button type="button" onClick={() => preencherFormulario(c)} style={{ background: 'transparent', color: '#aafac8', border: '1px solid rgba(138,255,196,0.3)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}>
                  Editar
                </button>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#9fe8c9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nome</div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: '#f0fff7' }}>{c.nome}</div>
              </div>

              <div style={{ color: '#dfffea' }}><strong>CPF:</strong> {c.cpf}</div>
              <div style={{ color: '#dfffea' }}><strong>E-mail:</strong> {c.email || 'Não informado'}</div>
              <div style={{ color: '#dfffea' }}><strong>Telefone:</strong> {c.telefone || 'Não informado'}</div>
            </div>
          );
        })}

        {clientes.length === 0 && (
          <div style={{ background: 'rgba(12, 34, 28, 0.9)', border: '1px solid rgba(134,255,194,0.15)', borderRadius: '12px', padding: '20px', color: '#dfffea' }}>
            Nenhum cliente cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}