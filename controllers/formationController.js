import {
    getAllFormations,
    searchFormations,
    searchFormationsAdvanced
} from '../services/formationService.js';
import { validatePagination, validateSort, validateFilters } from '../utils/stringUtils.js';

/**
 * Récupère toutes les formations
 */
export async function getFormations(req, res, next) {
    try {
        const formations = await getAllFormations();
        res.json({
            success: true,
            count: formations.length,
            data: formations
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Recherche simple par mot-clé uniquement
 * GET /formations/search?keyword=XXX
 */
export async function searchFormationsController(req, res, next) {
    try {
        const { keyword } = req.query;

        const results = await searchFormations(keyword);

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Recherche avancée avec pagination, filtres multiples et tri
 * GET /formations/advanced-search?keyword=XXX&niveau=YYY&prixMax=ZZZ&sort=AAA&order=BBB&page=N&limit=M
 */
export async function searchFormationsAdvancedController(req, res, next) {
    try {
        const { page, limit } = validatePagination(req.query.page, req.query.limit);
        const { sort, order } = validateSort(req.query.sort, req.query.order);
        const filters = validateFilters(req.query);

        const result = await searchFormationsAdvanced(filters, sort, order, page, limit);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
}
