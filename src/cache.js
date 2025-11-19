import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FORMATIONS_FILE = path.join(__dirname, '../data/formations.json');

let cache = null;
let lastLoadTime = null;
let hits = 0;
let misses = 0;
let watcher = null;
let reloadTimeout = null;

async function loadCache() {
    try {
        const start = Date.now();
        const data = await fsPromises.readFile(FORMATIONS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        cache = parsed;
        lastLoadTime = new Date();
        console.log(`Cache chargé avec ${cache.length} formations en ${Date.now()-start} ms.`);
    } catch (error) {
        console.error('Erreur lors du chargement du cache:', error);
        // keep old cache intact
    }
}

export async function getCachedFormations() {
    if (!cache) {
        misses++;
        await loadCache();
    } else {
        hits++;
    }
    return cache;
}

export function getCacheMetrics() {
    return {
        lastLoadTime,
        hits,
        misses
    };
}

export function startWatcher() {
    watcher = fs.watch(FORMATIONS_FILE, (eventType) => {
        if (eventType === 'change') {
            if (reloadTimeout) clearTimeout(reloadTimeout);
            reloadTimeout = setTimeout(async () => {
                console.log('Rechargement du cache après debounce...');
                await loadCache();
            }, 150);
        }
    });
}

export function closeWatcher() {
    if (watcher) {
        watcher.close();
    }
}

/**
 * Pour tests uniquement : override manuel du cache
 */
export function __testSetCache(newCache) {
    cache = newCache;
    lastLoadTime = new Date();
}

// Initial load + start watching file changes
await loadCache();
startWatcher();
