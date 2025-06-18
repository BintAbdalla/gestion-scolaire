import { Router } from 'express';
import niveauRoutes from './niveauRoutes';

const router = Router();

// Définition des routes principales
router.use('/niveaux', niveauRoutes);

// Route de santé de l'API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Kaayjang fonctionne correctement',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router; 