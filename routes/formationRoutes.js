import { Router } from 'express';
import { getFormations, searchFormationsController } from '../controllers/formationController.js';

const router = Router();

// GET /formations - Récupère toutes les formations
router.get('/', getFormations);

// GET /formations/search?keyword=XXX - Recherche par mot-clé
router.get('/search', searchFormationsController);

export default router;
