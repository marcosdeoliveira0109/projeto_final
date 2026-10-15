import { pool } from '../config/database';

export class ClienteModel {
  static async create(data: { nome: string; cpf: string; email: string; telefone: string }) {
    const [result]: any = await pool.execute(
      'INSERT INTO clientes (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)',
      [data.nome, data.cpf, data.email, data.telefone]
    );
    return result.insertId;
  }

  static async findByCpf(cpf: string) {
    const [rows]: any = await pool.execute('SELECT * FROM clientes WHERE cpf = ?', [cpf]);
    return rows[0] || null;
  }

  static async findAll() {
    const [rows]: any = await pool.execute('SELECT * FROM clientes');
    return rows;
  }

  static async findById(id: number) {
    const [rows]: any = await pool.execute('SELECT * FROM clientes WHERE id_clientes = ?', [id]);
    return rows[0] || null;
  }

  static async update(id: number, data: { nome: string; email: string; telefone: string }) {
    await pool.execute(
      'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id_clientes = ?',
      [data.nome, data.email, data.telefone, id]
    );
  }

  static async delete(id: number) {
    await pool.execute('DELETE FROM clientes WHERE id_clientes = ?', [id]);
  }
}
