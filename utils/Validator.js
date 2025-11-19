/**
 * Valide et sanitize les paramètres de pagination
 */
export function validatePagination(page, limit) {
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;

    return {
        page: Math.max(1, parsedPage),
        limit: Math.min(100, Math.max(1, parsedLimit))
    };
}

/**
 * Valide et sanitize les paramètres de tri
 */
export function validateSort(sort, order) {
    const validSortFields = ['prix', 'duree', 'titre'];
    const validOrders = ['asc', 'desc'];

    return {
        sort: validSortFields.includes(sort) ? sort : 'id',
        order: validOrders.includes(order) ? order : 'asc'
    };
}

/**
 * Valide et sanitize les filtres
 */
export function validateFilters(filters) {
    const validated = {};

    if (filters.niveau) {
        validated.niveau = String(filters.niveau).trim();
    }

    if (filters.prixMax) {
        const prix = parseFloat(filters.prixMax);
        if (!isNaN(prix) && prix >= 0) {
            validated.prixMax = prix;
        }
    }

    if (filters.dureeMin) {
        const duree = parseInt(filters.dureeMin);
        if (!isNaN(duree) && duree >= 0) {
            validated.dureeMin = duree;
        }
    }

    if (filters.keyword) {
        validated.keyword = String(filters.keyword).trim();
    }

    return validated;
}

/**
 * Normalise une chaîne en retirant les accents et en mettant en minuscules
 */
export function normalizeString(str) {
    if (!str) return '';

    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

