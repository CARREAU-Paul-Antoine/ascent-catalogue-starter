import { loadFormations } from '../dao/formationDao.js';

/**
 * Récupère toutes les formations
 */
export async function getAllFormations() {
    return await loadFormations();
}

/**
 * Recherche des formations par mot-clé dans le titre
 */
export async function searchFormations(keyword) {
    const formations = await loadFormations();

    if (!keyword) {
        return formations;
    }

    const lowerKeyword = keyword.toLowerCase();

    return formations.filter(formation =>
        formation.titre && formation.titre.toLowerCase().includes(lowerKeyword)
    );
}
