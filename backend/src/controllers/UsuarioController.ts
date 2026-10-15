import { Request, Response } from 'express';
import { UsuarioModel } from '../models/UsuarioModel';

export class UsuarioController {
  static async create(req: Request, res: Response) {
    try {
      const nome = String(req.body.nome || '').trim();
      const email = String(req.body.email || '').trim();
      const senha = String(req.body.senha || '').trim();
      const nivel_acesso = String(req.body.nivel_acesso || '').trim().toLowerCase();

      if (!nome || !email || !senha || !nivel_acesso) {
        return res.status(400).json({ error: 'Nome, email, senha e nível de acesso são obrigatórios.' });
      }

      if (nivel_acesso !== 'gerente' && nivel_acesso !== 'funcionario' && nivel_acesso !== 'vendedor') {
        return res.status(400).json({ error: 'Nível de acesso inválido. Use: gerente, funcionario ou vendedor.' });
      }

      const existente = await UsuarioModel.findByEmail(email);
      if (existente) {
        return res.status(409).json({ error: 'E-mail já cadastrado.' });
      }

      const id = await UsuarioModel.create({ nome, email, senha, nivel_acesso });
      return res.status(201).json({ id, nome, email, nivel_acesso });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }
}
