import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FORMATIONS_FILE = path.join(__dirname, '../data/formations.json');

export async function loadFormations() {
    const data = await fs.readFile(FORMATIONS_FILE, 'utf-8');
    return JSON.parse(data);
}
