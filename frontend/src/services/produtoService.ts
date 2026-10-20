import { api } from './api';

export interface ProdutoData {
  id?: number;
  codigo: string;
  descricao: string;
  preco: number;
  estoque: number;
}

export const produtoService = {
  async getAll() {
    const response = await api.get('/produtos');
    return response.data;
  },

  async create(produto: ProdutoData) {
    const response = await api.post('/produtos', produto);
    return response.data;
  },

  async update(id: number, produto: Partial<ProdutoData>) {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
  },
};