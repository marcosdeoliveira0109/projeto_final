import { VendaModel } from '../models/VendaModel';
import { UsuarioModel } from '../models/UsuarioModel';
import { ProdutoModel } from '../models/ProdutoModel';
import { AppError } from '../middlewares/errorHandler';

export class VendaService {
  static async realizarVenda(data: {
    usuarios_id_Usuarios: number;
    clientes_id_clientes: number;
    descoto?: number;
    itens: Array<{ produto_id: number; quantidade: number }>;
  }) {
    const usuario = await UsuarioModel.findById(data.usuarios_id_Usuarios);
    if (!usuario) throw new AppError('Usuário operador não encontrado.', 404);

    const desconto = data.descoto || 0;

    // Regra de Negócio: Descontos > 10% exigem perfil GERENTE
    if (desconto > 10 && usuario.nivel_acesso !== 'gerente') {
      throw new AppError('Alçada negada: Descontos acima de 10% exigem nível de acesso GERENTE.', 403);
    }

    let valorBruto = 0;
    const itensProcessados = [];

    for (const item of data.itens) {
      const produto = await ProdutoModel.findById(item.produto_id);
      if (!produto) throw new AppError(`Produto ID ${item.produto_id} não encontrado.`, 404);

      if (produto.estoque < item.quantidade) {
        throw new AppError(`Estoque insuficiente para o produto: ${produto.descricao}. Disponível: ${produto.estoque}`, 400);
      }

      const subtotalItem = Number(produto.preco) * item.quantidade;
      valorBruto += subtotalItem;

      itensProcessados.push({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: Number(produto.preco),
        subtotal: subtotalItem
      });
    }

    const valorTotalFinal = valorBruto - desconto;

    const vendaId = await VendaModel.createWithTransaction({
      usuarios_id_Usuarios: data.usuarios_id_Usuarios,
      clientes_id_clientes: data.clientes_id_clientes,
      valor_total: valorTotalFinal,
      descoto: desconto,
      itens: itensProcessados
    });

    return { id: vendaId, valor_total: valorTotalFinal, status: 'concluida' };
  }

  static async cancelarVenda(vendaId: number, gerenteId: number) {
    const usuario = await UsuarioModel.findById(gerenteId);
    if (!usuario || usuario.nivel_acesso !== 'gerente') {
      throw new AppError('Acesso negado: Apenas gerentes podem cancelar vendas.', 403);
    }

    const venda = await VendaModel.findById(vendaId);
    if (!venda) throw new AppError('Venda não encontrada.', 404);

    if (venda.status === 'cancelada') {
      throw new AppError('Esta venda já se encontra cancelada.', 400);
    }

    await VendaModel.cancelar(vendaId);
    return { message: 'Venda cancelada com sucesso.' };
  }
}