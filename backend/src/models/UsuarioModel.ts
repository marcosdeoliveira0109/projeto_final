import { pool } from '../config/database';

export class UsuarioModel {
  static async create(data: { nome: string; email: string; senha: string; nivel_acesso: string }) {
    const [result]: any = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)',
      [data.nome, data.email, data.senha, data.nivel_acesso]
    );
    return result.insertId;
  }

  static async findById(id: number) {
    const [rows]: any = await pool.execute('SELECT * FROM usuarios WHERE id_Usuarios = ?', [id]);
    return rows[0] || null;
  }

  static async findByEmail(email: string) {
    const [rows]: any = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0] || null;
  }
}
