import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier JSON
const FORMATIONS_FILE = path.join(__dirname, '../data/formations.json');

// Lecture synchrone unique au démarrage
let cachedFormations = [];

try {
    const data = fs.readFileSync(FORMATIONS_FILE, 'utf-8');
    cachedFormations = JSON.parse(data);

    console.log(`Mise en cache synchrone : ${cachedFormations.length} formations chargées.`);
} catch (error) {
    console.error('Erreur lors du chargement synchronisé du catalogue:', error);
    cachedFormations = [];
}

/**
 * Fonction pour récupérer les formations en cache
 */
export function getCachedFormations() {
    return cachedFormations;
}
