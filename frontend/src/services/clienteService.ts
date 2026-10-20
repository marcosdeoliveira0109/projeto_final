import { api } from './api';

const STORAGE_KEY = 'ms2_clientes_por_usuario';

export interface ClienteData {
  id?: number | string;
  id_clientes?: number | string;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  usuarios_id_Usuarios?: number;
}

function getUsuarioLogado() {
  try {
    const usuario = localStorage.getItem('ms2_usuario_logado');
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
}

function getClientesPorUsuario(): Record<number, ClienteData[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function salvarClientesPorUsuario(map: Record<number, ClienteData[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export const clienteService = {
  async getAll() {
    const usuario = getUsuarioLogado();
    const map = getClientesPorUsuario();

    if (usuario?.id) {
      const lista = map[usuario.id] || [];
      if (lista.length > 0) {
        return lista;
      }
    }

    try {
      const response = await api.get('/clientes');
      const clientes = Array.isArray(response.data) ? response.data : [];

      if (usuario?.id) {
        const meusClientes = clientes.filter((cliente: any) => Number(cliente.usuarios_id_Usuarios ?? usuario.id) === Number(usuario.id));
        if (meusClientes.length > 0) {
          map[usuario.id] = meusClientes;
          salvarClientesPorUsuario(map);
          return meusClientes;
        }
      }

      return clientes;
    } catch {
      return usuario?.id ? map[usuario.id] || [] : [];
    }
  },

  async getById(id: number) {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async create(cliente: ClienteData) {
    const usuario = getUsuarioLogado();
    const map = getClientesPorUsuario();

    const novoCliente: ClienteData = {
      ...cliente,
      id: cliente.id ?? Date.now(),
      usuarios_id_Usuarios: usuario?.id ?? cliente.usuarios_id_Usuarios,
    };

    if (usuario?.id) {
      const listaAtual = map[usuario.id] || [];
      map[usuario.id] = [novoCliente, ...listaAtual];
      salvarClientesPorUsuario(map);
      return novoCliente;
    }

    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  async update(id: number, cliente: Partial<ClienteData>) {
    const usuario = getUsuarioLogado();
    const map = getClientesPorUsuario();

    if (usuario?.id && map[usuario.id]) {
      map[usuario.id] = (map[usuario.id] || []).map((item) => {
        const itemId = Number(item.id ?? item.id_clientes ?? 0);
        return itemId === Number(id) ? { ...item, ...cliente } : item;
      });
      salvarClientesPorUsuario(map);
      return { ok: true };
    }

    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },
};