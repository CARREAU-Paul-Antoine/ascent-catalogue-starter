import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateFormations, generateValidationReport } from '../validators/formationValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FORMATIONS_FILE = path.join(__dirname, '../data/formations.json');

/**
 * Charge et valide les formations depuis le fichier JSON
 * @returns {Promise<Array>} Liste des formations valides uniquement
 */
export async function loadFormations() {
    const data = await fs.readFile(FORMATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    // Validation des formations
    const validationResult = validateFormations(parsed);

    // Logger le rapport de validation
    if (validationResult.errors.length > 0 || validationResult.warnings.length > 0) {
        console.warn(generateValidationReport(validationResult));
    }

    // Retourner uniquement les formations valides
    return validationResult.valid;
}
