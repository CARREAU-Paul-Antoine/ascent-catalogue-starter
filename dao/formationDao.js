import {getCachedFormations} from "../src/cache.js";


/**
 * Charge et valide les formations depuis le fichier JSON
 * @returns {Promise<Array>} Liste des formations valides uniquement
 */

export async function loadFormations() {
    return getCachedFormations();
}
