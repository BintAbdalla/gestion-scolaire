import { Router } from 'express';
import { NiveauController } from '../controllers/NiveauController';

const router = Router();
const niveauController = new NiveauController();

// Routes pour les niveaux
router.get('/', niveauController.getAll.bind(niveauController));
router.get('/:id', niveauController.getById.bind(niveauController));
router.post('/', niveauController.create.bind(niveauController));
router.put('/:id', niveauController.update.bind(niveauController));
router.delete('/:id', niveauController.delete.bind(niveauController));

export default router; 