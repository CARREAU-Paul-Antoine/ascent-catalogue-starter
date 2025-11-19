import { Router } from 'express';
import { getFormations, searchFormationsController, searchFormationsAdvancedController} from '../controllers/formationController.js';
import {validateSearchParams} from "../middlewares/validation.js";
import { getCacheMetricsController } from '../controllers/cacheController.js';

const router = Router();

// GET /formations - Récupère toutes les formations
router.get('/', getFormations);

// GET /formations/search?keyword=XXX - Recherche par mot-clé
router.get('/search', searchFormationsController);

// GET /formations/advanced-search - Recherche avancée avec pagination, filtres et tri
// Exemples d'utilisation :
// ?keyword=node&page=1&limit=10
// ?niveau=Intermédiaire&prixMax=500&dureeMin=2
// ?sort=prix&order=asc
// ?keyword=express&niveau=Avancé&prixMax=800&sort=duree&order=desc&page=1&limit=5
router.get('/advanced-search', validateSearchParams, searchFormationsAdvancedController);


router.get('/cache-metrics', getCacheMetricsController);



export default router;
