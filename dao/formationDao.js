import { validateFormations, generateValidationReport } from '../validators/formationValidator.js';
import * as cache from '../src/cache.js';

/**
 * Charge et valide les formations depuis le cache asynchrone
 * @returns {Promise<Array>} Liste des formations valides uniquement
 */
export async function loadFormations() {
    // Récupère les formations mises en cache
    const cachedData = await cache.getCachedFormations();

    // Valide les formations
    const validationResult = validateFormations(cachedData);

    // Log le rapport de validation si erreurs ou warnings
    if ((validationResult.errors.length > 0 || validationResult.warnings.length > 0) && process.env.NODE_ENV !== 'test') {
        console.warn(generateValidationReport(validationResult));
    }

    // Retourne uniquement les formations valides
    return validationResult.valid;
}
