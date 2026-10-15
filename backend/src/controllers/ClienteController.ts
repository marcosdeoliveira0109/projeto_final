import { Request, Response, NextFunction } from 'express';
import { ClienteModel } from '../models/ClienteModel';
import { AppError } from '../middlewares/errorHandler';

export class ClienteController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, cpf, email, telefone } = req.body;
      if (!nome || !cpf) throw new AppError('Nome e CPF são obrigatórios.');

      const cpfLimpo = String(cpf).replace(/\D/g, '');
      if (!cpfLimpo) throw new AppError('CPF inválido.', 400);

      const existente = await ClienteModel.findByCpf(cpfLimpo);
      if (existente) {
        throw new AppError('Já existe um cliente cadastrado com este CPF.', 409);
      }

      const id = await ClienteModel.create({ nome, cpf: cpfLimpo, email, telefone });
      return res.status(201).json({ id, nome, cpf: cpfLimpo, email, telefone });
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const clientes = await ClienteModel.findAll();
      return res.json(clientes);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const cliente = await ClienteModel.findById(Number(req.params.id));
      if (!cliente) throw new AppError('Cliente não encontrado.', 404);
      return res.json(cliente);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, telefone } = req.body;
      await ClienteModel.update(Number(req.params.id), { nome, email, telefone });
      return res.json({ message: 'Cliente atualizado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ClienteModel.delete(Number(req.params.id));
      return res.json({ message: 'Cliente removido com sucesso.' });
    } catch (error) {
      next(error);
    }
  }
}
