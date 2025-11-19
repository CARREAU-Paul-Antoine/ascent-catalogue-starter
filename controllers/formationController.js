import { getAllFormations, searchFormations } from '../services/formationService.js';

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
