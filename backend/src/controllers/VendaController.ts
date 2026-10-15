import { Request, Response, NextFunction } from 'express';
import { VendaService } from '../services/VendaService';

export class VendaController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await VendaService.realizarVenda(req.body);
      return res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { gerente_id } = req.body;
      const resultado = await VendaService.cancelarVenda(Number(id), Number(gerente_id));
      return res.json(resultado);
    } catch (error) {
      next(error);
    }
  }
}
