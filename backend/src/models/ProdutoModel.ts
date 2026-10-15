import { pool } from '../config/database';

export class ProdutoModel {
  static async create(data: { codigo: string; descricao: string; preco: number; estoque: number }) {
    const [result]: any = await pool.execute(
      'INSERT INTO produtos (codigo, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
      [data.codigo, data.descricao, data.preco, data.estoque]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows]: any = await pool.execute('SELECT * FROM produtos');
    return rows;
  }

  static async findById(id: number) {
    const [rows]: any = await pool.execute('SELECT * FROM produtos WHERE id_produtos = ?', [id]);
    return rows[0] || null;
  }

  static async findByCodigo(codigo: string) {
    const [rows]: any = await pool.execute('SELECT * FROM produtos WHERE codigo = ?', [codigo]);
    return rows[0] || null;
  }

  static async update(id: number, data: { codigo?: string; descricao?: string; preco?: number; estoque?: number }) {
    const campos: string[] = [];
    const valores: any[] = [];

    if (data.codigo !== undefined) {
      campos.push('codigo = ?');
      valores.push(data.codigo);
    }
    if (data.descricao !== undefined) {
      campos.push('descricao = ?');
      valores.push(data.descricao);
    }
    if (data.preco !== undefined) {
      campos.push('preco = ?');
      valores.push(data.preco);
    }
    if (data.estoque !== undefined) {
      campos.push('estoque = ?');
      valores.push(data.estoque);
    }

    if (campos.length === 0) return;

    valores.push(id);
    await pool.execute(
      `UPDATE produtos SET ${campos.join(', ')} WHERE id_produtos = ?`,
      valores
    );
  }

  static async delete(id: number) {
    await pool.execute('DELETE FROM produtos WHERE id_produtos = ?', [id]);
  }

  static async updateEstoque(id: number, novoEstoque: number) {
    await pool.execute('UPDATE produtos SET estoque = ? WHERE id_produtos = ?', [novoEstoque, id]);
  }
}
