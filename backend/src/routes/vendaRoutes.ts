import { Router } from 'express';
import { VendaController } from '../controllers/VendaController';
const router = Router();
router.post('/', VendaController.create);
router.patch('/:id/cancelar', VendaController.cancelar);
export default router;
