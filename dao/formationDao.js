import { validateFormations, generateValidationReport } from '../validators/formationValidator.js';
import cache from '../src/cache.js'; // Import du module cache.js

/**
 * Charge et valide les formations depuis le cache asynchrone
 * @returns {Promise<Array>} Liste des formations valides uniquement
 */
export async function loadFormations() {
    const cachedData = await cache.getCachedFormations();

    // Validation des formations
    const validationResult = validateFormations(cachedData);

    // Logger le rapport de validation si erreurs/warnings
    if (validationResult.errors.length > 0 || validationResult.warnings.length > 0) {
        console.warn(generateValidationReport(validationResult));
    }

    // Retourner uniquement les formations valides
    return validationResult.valid;
}
