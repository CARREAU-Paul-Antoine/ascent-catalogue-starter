import { normalizeString } from '../utils/stringUtils.js';

/**
 * Middleware de validation pour l'endpoint de recherche
 */
export function validateSearchParams(req, res, next) {
    const errors = [];

    // Validation keyword
    if (req.query.keyword) {
        const keyword = String(req.query.keyword).trim();
        if (keyword.length > 100) {
            errors.push('Le mot-clé ne peut pas dépasser 100 caractères');
        }
        // Sanitization basique : retirer caractères dangereux
        req.query.keyword = keyword.replace(/[<>]/g, '');
    }

    // Validation niveau
    const niveauxValides = ['débutant', 'intermédiaire', 'avancé'];
    if (req.query.niveau) {
        const niveau = normalizeString(req.query.niveau);
        if (!niveauxValides.includes(niveau)) {
            errors.push('Niveau invalide. Valeurs autorisées : Débutant, Intermédiaire, Avancé');
        }
    }

    // Validation prixMax
    if (req.query.prixMax !== undefined) {
        const prix = parseFloat(req.query.prixMax);
        if (isNaN(prix)) {
            errors.push('prixMax doit être un nombre');
        } else if (prix < 0) {
            errors.push('prixMax ne peut pas être négatif');
        } else if (prix > 100000) {
            errors.push('prixMax ne peut pas dépasser 100000');
        }
    }

    // Validation dureeMin
    if (req.query.dureeMin !== undefined) {
        const duree = parseInt(req.query.dureeMin);
        if (isNaN(duree)) {
            errors.push('dureeMin doit être un nombre entier');
        } else if (duree < 0) {
            errors.push('dureeMin ne peut pas être négatif');
        } else if (duree > 365) {
            errors.push('dureeMin ne peut pas dépasser 365 jours');
        }
    }

    // Validation page
    if (req.query.page !== undefined) {
        const page = parseInt(req.query.page);
        if (isNaN(page) || page < 1) {
            errors.push('page doit être un nombre entier positif');
        }
    }

    // Validation limit
    if (req.query.limit !== undefined) {
        const limit = parseInt(req.query.limit);
        if (isNaN(limit) || limit < 1) {
            errors.push('limit doit être un nombre entier positif');
        } else if (limit > 100) {
            errors.push('limit ne peut pas dépasser 100');
        }
    }

    // Si des erreurs de validation, retourner 400
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation échouée',
            details: errors
        });
    }

    next();
}
