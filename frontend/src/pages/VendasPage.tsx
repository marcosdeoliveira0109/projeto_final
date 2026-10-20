import { useEffect, useState } from 'react';
import type { UsuarioLogado } from '../App';
import { vendaService } from '../services/vendaService';

const HISTORICO_VENDAS_KEY = 'ms2_historico_vendas';

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

export function VendasPage({ usuario }: { usuario: UsuarioLogado }) {
  const [vendas, setVendas] = useState<VendaHistorico[]>([]);

  function carregarHistorico() {
    try {
      const dados = JSON.parse(localStorage.getItem(HISTORICO_VENDAS_KEY) || '[]');
      setVendas(dados);
    } catch {
      setVendas([]);
    }
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function handleCancelarVenda(vendaId: number | string) {
    if (usuario.role !== 'gerente') {
      alert('Apenas o gerente pode cancelar vendas.');
      return;
    }

    const vendaSelecionada = vendas.find((venda) => String(venda.id) === String(vendaId));
    if (!vendaSelecionada) {
      return;
    }

    try {
      await vendaService.cancelarVenda(Number(vendaId), usuario.id);
    } catch (error: any) {
      console.warn('Erro no backend ao cancelar venda, usando histórico local.', error);
    }

    const atualizadas: VendaHistorico[] = vendas.map((venda) =>
      String(venda.id) === String(vendaId)
        ? {
            ...venda,
            status: 'cancelada',
            cancelada_por: usuario.nome,
            cancelada_em: new Date().toISOString(),
          }
        : venda
    );

    localStorage.setItem(HISTORICO_VENDAS_KEY, JSON.stringify(atualizadas));
    setVendas(atualizadas);
    alert('Venda cancelada com sucesso.');
  }

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Histórico de Vendas</h2>

      {vendas.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)' }}>
          Nenhuma venda registrada ainda.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {vendas.map((venda) => (
            <div
              key={String(venda.id)}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '18px 20px',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)',
                borderLeft: venda.status === 'cancelada' ? '5px solid #ef4444' : '5px solid #10b981',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div>
                  <strong>Venda #{venda.id}</strong>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>
                    {new Date(venda.criado_em || Date.now()).toLocaleString('pt-BR')}
                  </div>
                </div>

                <span
                  style={{
                    padding: '6px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: venda.status === 'cancelada' ? '#fee2e2' : '#dcfce7',
                    color: venda.status === 'cancelada' ? '#991b1b' : '#166534',
                  }}
                >
                  {venda.status === 'cancelada' ? 'Cancelada' : 'Concluída'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', color: '#334155' }}>
                <div><strong>Cliente:</strong> {venda.clientes_id_clientes}</div>
                <div><strong>Operador:</strong> {venda.usuarios_id_Usuarios}</div>
                <div><strong>Desconto:</strong> R$ {Number(venda.descoto || 0).toFixed(2)}</div>
                <div><strong>Total:</strong> R$ {Number(venda.valor_total || 0).toFixed(2)}</div>
              </div>

              <div style={{ marginTop: '12px', color: '#475569', fontSize: '14px' }}>
                <strong>Itens:</strong>{' '}
                {venda.itens.map((item) => `Produto ${item.produto_id} × ${item.quantidade}`).join(' | ') || 'Sem itens'}
              </div>

              {venda.status === 'cancelada' && venda.cancelada_por && (
                <div style={{ marginTop: '12px', color: '#b91c1c', fontSize: '13px' }}>
                  Cancelada por {venda.cancelada_por} em {new Date(venda.cancelada_em || Date.now()).toLocaleString('pt-BR')}
                </div>
              )}

              {usuario.role === 'gerente' && venda.status !== 'cancelada' && (
                <button
                  type="button"
                  onClick={() => handleCancelarVenda(venda.id)}
                  style={{ marginTop: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancelar venda
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
