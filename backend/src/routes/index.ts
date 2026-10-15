import { Router } from 'express';
import clienteRoutes from './clienteRoutes';
import produtoRoutes from './produtoRoutes';
import vendaRoutes from './vendaRoutes';

const router = Router();

router.use('/clientes', clienteRoutes);
router.use('/produtos', produtoRoutes);
router.use('/vendas', vendaRoutes);

export default router;
