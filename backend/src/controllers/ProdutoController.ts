import { Request, Response } from 'express';
import { ProdutoModel } from '../models/ProdutoModel';

export class ProdutoController {
  static async create(req: Request, res: Response) {
    try {
      const codigo = String(req.body.codigo || '').trim();
      const descricao = String(req.body.descricao || '').trim();
      const preco = Number(req.body.preco);
      const estoque = Number(req.body.estoque);

      if (!codigo || !descricao || Number.isNaN(preco) || Number.isNaN(estoque)) {
        return res.status(400).json({ error: 'Código, descrição, preço e estoque são obrigatórios.' });
      }

      const existente = await ProdutoModel.findByCodigo(codigo);
      if (existente) {
        return res.status(409).json({ error: 'Código de produto já cadastrado.' });
      }

      const id = await ProdutoModel.create({ codigo, descricao, preco, estoque });
      return res.status(201).json({ id, codigo, descricao, preco, estoque });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }
  }

  static async findAll(req: Request, res: Response) {
    const produtos = await ProdutoModel.findAll();
    return res.json(produtos);
  }

  static async findById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    const produto = await ProdutoModel.findById(id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' });
    return res.json(produto);
  }

  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const produtoAtual = await ProdutoModel.findById(id);
      if (!produtoAtual) return res.status(404).json({ error: 'Produto não encontrado.' });

      const codigo = req.body.codigo !== undefined ? String(req.body.codigo).trim() : produtoAtual.codigo;
      const descricao = req.body.descricao !== undefined ? String(req.body.descricao).trim() : produtoAtual.descricao;
      const preco = req.body.preco !== undefined ? Number(req.body.preco) : Number(produtoAtual.preco);
      const estoque = req.body.estoque !== undefined ? Number(req.body.estoque) : Number(produtoAtual.estoque);

      if (!codigo || !descricao || Number.isNaN(preco) || Number.isNaN(estoque)) {
        return res.status(400).json({ error: 'Dados inválidos para atualização do produto.' });
      }

      if (codigo !== produtoAtual.codigo) {
        const existente = await ProdutoModel.findByCodigo(codigo);
        if (existente) {
          return res.status(409).json({ error: 'Código de produto já cadastrado.' });
        }
      }

      await ProdutoModel.update(id, { codigo, descricao, preco, estoque });
      return res.json({ message: 'Produto atualizado com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const produto = await ProdutoModel.findById(id);
      if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' });

      await ProdutoModel.delete(id);
      return res.json({ message: 'Produto removido com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover produto.' });
    }
  }
}
