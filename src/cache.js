import fs from 'fs/promises';
import fsWatch from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FORMATIONS_FILE = path.join(__dirname, '../data/formations.json');

let cache = null;
let lastLoadTime = null;
let hits = 0;
let misses = 0;
let reloadTimeout = null;

// Charger le cache initialement
async function loadCache() {
    try {
        const data = await fs.readFile(FORMATIONS_FILE, 'utf-8');
        cache = JSON.parse(data);
        lastLoadTime = new Date();
        console.log(`Cache chargé avec ${cache.length} formations.`);
    } catch (error) {
        console.error('Erreur lors du chargement du cache:', error);
    }
}

// Surveillance asynchrone des modifications du fichier

fsWatch.watch(FORMATIONS_FILE, (eventType) => {
    if (eventType === 'change') {
        if (reloadTimeout) clearTimeout(reloadTimeout);
        reloadTimeout = setTimeout(async () => {
            console.log('Rechargement du cache après debounce...');
            try {
                await loadCache();
            } catch (e) {
                console.error('Erreur lors du rechargement debounce:', e);
            }
        }, 150); // délai 150ms
    }
});

// Récupération des formations avec comptage des hits/misses
export async function getCachedFormations() {
    if (!cache) {
        misses++;
        await loadCache();
    } else {
        hits++;
    }
    return cache;
}

// Accès aux métriques
export function getCacheMetrics() {
    return {
        lastLoadTime,
        hits,
        misses
    };
}

// Charger le cache au démarrage
loadCache();

export default {
    getCachedFormations,
    getCacheMetrics
};
