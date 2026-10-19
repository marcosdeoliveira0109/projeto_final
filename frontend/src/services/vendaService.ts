import { api } from './api';

export interface ItemVendaData {
  produto_id: number;
  quantidade: number;
}

export interface VendaData {
  usuarios_id_Usuarios: number;
  clientes_id_clientes: number;
  descoto?: number;
  itens: ItemVendaData[];
}

export const vendaService = {
  async realizarVenda(venda: VendaData) {
    const response = await api.post('/vendas', venda);
    return response.data;
  },

  async cancelarVenda(vendaId: number, gerenteId: number) {
    const response = await api.patch(`/vendas/${vendaId}/cancelar`, {
      gerente_id: gerenteId,
    });
    return response.data;
  },
};