import { validateFormations, generateValidationReport } from '../validators/formationValidator.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FORMATIONS_FILE = path.join(__dirname, '../data/formations.json');

async function testValidation() {
    try {
        const data = await fs.readFile(FORMATIONS_FILE, 'utf-8');
        const formations = JSON.parse(data);

        const validationResult = validateFormations(formations);
        const report = generateValidationReport(validationResult);

        console.log(report);

        // Sauvegarder les formations valides dans un nouveau fichier
        if (validationResult.valid.length > 0) {
            const cleanedFile = path.join(__dirname, '../data/formations-clean.json');
            await fs.writeFile(cleanedFile, JSON.stringify(validationResult.valid, null, 2));
            console.log(`\n✅ ${validationResult.valid.length} formations valides sauvegardées dans formations-clean.json`);
        }
    } catch (error) {
        console.error('Erreur lors du test de validation:', error);
    }
}

testValidation();
