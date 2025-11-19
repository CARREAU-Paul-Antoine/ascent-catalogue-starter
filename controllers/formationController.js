import { getAllFormations, searchFormations, searchFormationsAdvanced } from '../services/formationService.js';
import { validatePagination, validateSort, validateFilters } from '../utils/Validator.js';

/**
 * Récupère toutes les formations
 */
export async function getFormations(req, res) {
    const formations = await getAllFormations();
    res.json(formations);
}

/**
 * Recherche des formations par mot-clé
 */
export async function searchFormationsController(req, res) {
    const { keyword } = req.query;
    const results = await searchFormations(keyword);
    res.json(results);
}

/**
 * Recherche avancée avec pagination, filtres et tri
 */
export async function searchFormationsAdvancedController(req, res) {
    // Validation et sanitization des paramètres
    const { page, limit } = validatePagination(req.query.page, req.query.limit);
    const { sort, order } = validateSort(req.query.sort, req.query.order);
    const filters = validateFilters(req.query);

    const result = await searchFormationsAdvanced(filters, sort, order, page, limit);

    res.json(result);
}
