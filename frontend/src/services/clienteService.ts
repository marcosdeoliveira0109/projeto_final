import { api } from './api';

export interface ClienteData {
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
}

export const clienteService = {
  async getAll() {
    const response = await api.get('/clientes');
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async create(cliente: ClienteData) {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },
};