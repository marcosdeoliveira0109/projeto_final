import { pool } from '../config/database';

export class VendaModel {
  static async createWithTransaction(data: {
    usuarios_id_Usuarios: number;
    clientes_id_clientes: number;
    valor_total: number;
    descoto: number;
    itens: Array<{ produto_id: number; quantidade: number; preco_unitario: number }>;
  }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Inserir Venda
      const [vendaResult]: any = await connection.execute(
        'INSERT INTO vendas (usuarios_id_Usuarios, clientes_id_clientes, valor_total, descoto, status) VALUES (?, ?, ?, ?, "concluida")',
        [data.usuarios_id_Usuarios, data.clientes_id_clientes, data.valor_total, data.descoto]
      );
      const vendaId = vendaResult.insertId;

      // Inserir Itens e atualizar stock
      for (const item of data.itens) {
        const subtotal = item.quantidade * item.preco_unitario;
        
        await connection.execute(
          'INSERT INTO itens_vendas (quantidade, preco_unitario, subtotal, vendas_id_vendas, vendas_usuarios_id_Usuarios, vendas_clientes_id_clientes, produtos_id_produtos) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [item.quantidade, item.preco_unitario, subtotal, vendaId, data.usuarios_id_Usuarios, data.clientes_id_clientes, item.produto_id]
        );

        // Baixa no stock
        await connection.execute(
          'UPDATE produtos SET estoque = estoque - ? WHERE id_produtos = ?',
          [item.quantidade, item.produto_id]
        );
      }

      await connection.commit();
      return vendaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id: number) {
    const [rows]: any = await pool.execute('SELECT * FROM vendas WHERE id_vendas = ?', [id]);
    return rows[0] || null;
  }

  static async cancelar(id: number) {
    await pool.execute('UPDATE vendas SET status = "cancelada" WHERE id_vendas = ?', [id]);
  }
}
