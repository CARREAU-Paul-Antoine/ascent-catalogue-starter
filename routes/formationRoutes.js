import { Router } from 'express';
import { getFormations, searchFormationsController, searchFormationsAdvancedController} from '../controllers/formationController.js';
import {validateSearchParams} from "../middlewares/validation.js";
import { getCacheMetricsController } from '../controllers/cacheController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Formations
 *   description: Gestion des formations
 */


// GET /formations - Récupère toutes les formations
/**
 * @swagger
 * /formations:
 *   get:
 *     summary: Liste toutes les formations
 *     tags: [Formations]
 *     responses:
 *       200:
 *         description: Liste des formations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Formation'
 */
router.get('/', getFormations);

// GET /formations/search?keyword=XXX - Recherche par mot-clé
/**
 * @swagger
 * /formations/search:
 *   get:
 *     summary: Recherche des formations par mot-clé
 *     tags: [Formations]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Mot-clé pour la recherche
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 */
router.get('/search', searchFormationsController);

// GET /formations/advanced-search - Recherche avancée avec pagination, filtres et tri
// Exemples d'utilisation :
// ?keyword=node&page=1&limit=10
// ?niveau=Intermédiaire&prixMax=500&dureeMin=2
// ?sort=prix&order=asc
// ?keyword=express&niveau=Avancé&prixMax=800&sort=duree&order=desc&page=1&limit=5
/**
 * @swagger
 * /formations/advanced-search:
 *   get:
 *     summary: Recherche avancée des formations avec filtres, tri et pagination
 *     tags: [Formations]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Mot-clé pour la recherche dans le titre ou la description
 *       - in: query
 *         name: niveau
 *         schema:
 *           type: string
 *           enum: [Débutant, Intermédiaire, Avancé]
 *         description: Filtrer par niveau de formation
 *       - in: query
 *         name: prixMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Prix maximum
 *       - in: query
 *         name: dureeMin
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Durée minimum en jours
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [prix, duree, titre]
 *           default: titre
 *         description: Champ de tri
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordre de tri
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d’éléments par page
 *     responses:
 *       200:
 *         description: Résultats paginés des formations correspondant aux filtres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Formation'
 *       400:
 *         description: Paramètres invalides
 */
router.get('/advanced-search', validateSearchParams, searchFormationsAdvancedController);


router.get('/cache-metrics', getCacheMetricsController);



export default router;
