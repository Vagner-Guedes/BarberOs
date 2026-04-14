import { Router } from 'express';
import { professionalController } from '../controllers/professionalController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', professionalController.list);
router.get('/:id', professionalController.getById);
router.post('/', professionalController.create);
router.put('/:id', professionalController.update);
router.delete('/:id', professionalController.delete);

export default router;
