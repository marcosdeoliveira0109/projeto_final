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

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const dados = await clienteService.getAll();
      setClientes(dados);
    } catch (error: any) {
      console.error('Erro ao carregar clientes', error);
    }
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await clienteService.create({ nome, cpf, email, telefone });
      setSucesso('Cliente cadastrado com sucesso!');
      setNome('');
      setCpf('');
      setEmail('');
      setTelefone('');
      carregarClientes();
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao cadastrar cliente.');
    }
  }

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>👥 Gestão de Clientes - MS² Vestuário</h2>

      {erro && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{erro}</div>}
      {sucesso && <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{sucesso}</div>}

      <form onSubmit={handleCadastrar} style={{ display: 'flex', flexDirection: 'column', width: '350px', gap: '12px', marginBottom: '30px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '16px', color: '#334155' }}>Novo Cliente</h3>
        <input placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input placeholder="CPF (apenas números ou formatado)" value={cpf} onChange={e => setCpf(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input placeholder="Telefone / Telemóvel" value={telefone} onChange={e => setTelefone(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Cliente</button>
      </form>

      <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>Lista de Clientes Cadastrados</h3>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '700px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {clientes.map((c: any) => (
            <li key={c.id_clientes} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>{c.nome}</strong> (CPF: {c.cpf})</span>
              <span style={{ color: '#64748b', fontSize: '14px' }}>{c.telefone || 'Sem telefone'}</span>
            </li>
          ))}
          {clientes.length === 0 && <p style={{ color: '#64748b' }}>Nenhum cliente cadastrado.</p>}
        </ul>
      </div>
    </div>
  );
}