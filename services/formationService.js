import { loadFormations } from '../dao/formationDao.js';
import { normalizeString } from '../utils/stringUtils.js';

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

    const normalizedKeyword = normalizeString(keyword);

    return formations.filter(formation =>
        formation.titre && normalizeString(formation.titre).includes(normalizedKeyword)
    );
}

/**
 * Recherche avancée avec pagination, filtres et tri
 */
export async function searchFormationsAdvanced(filters, sort, order, page, limit) {
    let formations = await loadFormations();

    // Appliquer les filtres
    if (filters.keyword) {
        const normalizedKeyword = normalizeString(filters.keyword);
        formations = formations.filter(formation =>
            formation.titre && normalizeString(formation.titre).includes(normalizedKeyword)
        );
    }

    if (filters.niveau) {
        const normalizedNiveau = normalizeString(filters.niveau);
        formations = formations.filter(formation =>
            formation.niveau && normalizeString(formation.niveau) === normalizedNiveau
        );
    }

    if (filters.prixMax !== undefined) {
        formations = formations.filter(formation =>
            formation.prix && formation.prix <= filters.prixMax
        );
    }

    if (filters.dureeMin !== undefined) {
        formations = formations.filter(formation =>
            formation.duree && formation.duree >= filters.dureeMin
        );
    }

    // Appliquer le tri
    formations = sortFormations(formations, sort, order);

    // Calculer les métadonnées de pagination
    const total = formations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Appliquer la pagination
    const paginatedFormations = formations.slice(startIndex, endIndex);

    return {
        data: paginatedFormations,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

/**
 * Trie les formations selon le champ et l'ordre spécifiés
 */
function sortFormations(formations, sort, order) {
    return formations.sort((a, b) => {
        let aValue = a[sort];
        let bValue = b[sort];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (typeof aValue === 'string') {
            aValue = normalizeString(aValue);
            bValue = normalizeString(bValue);
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
}
