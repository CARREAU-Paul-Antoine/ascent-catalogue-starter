import request from 'supertest';
import express from 'express';
import formationRoutes from '../routes/formationRoutes.js';
import * as cache from '../src/cache.js';
import { validateFormations } from '../validators/formationValidator.js';
import * as dao from '../dao/formationDao.js';

const app = express();
app.use(express.json());
app.use('/formations', formationRoutes);

describe('Ascent Catalogue Tests', () => {
    afterAll(() => {
        cache.closeWatcher();
    });

    test('Recherche par mot-clé "Node"', async () => {
        const res = await request(app).get('/formations/search?keyword=node');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('Chargement catalogue fonctionne', async () => {
        const formations = await dao.loadFormations();
        expect(Array.isArray(formations)).toBe(true);
    });

    test('Cache charge une fois puis même instance', async () => {
        const first = await cache.getCachedFormations();
        const second = await cache.getCachedFormations();
        expect(first).toBe(second);
    });

    test('Cache se met à jour après override', async () => {
        const initial = await cache.getCachedFormations();
        cache.__testSetCache([{ id: 999, titre: 'Test Formation' }]);
        const updated = await cache.getCachedFormations();
        expect(updated).toEqual([{ id: 999, titre: 'Test Formation' }]);
        cache.__testSetCache(initial);
    });

    test('Validation détecte doublons et champs manquants', () => {
        const dataErr = [
            { id: 1, titre: 'Formation', description: 'desc', duree: 2, niveau: 'Débutant', prix: 50, formateur: 'Jean' },
            { id: 1, titre: 'Doublon', description: 'desc', duree: 2, niveau: 'Débutant', prix: 50 },
            { titre: 'Pas d’id', description: 'desc', duree: 2, niveau: 'Intermédiaire', prix: 100, formateur: 'Paul' }
        ];
        const res = validateFormations(dataErr);
        expect(res.invalid.length).toBeGreaterThanOrEqual(2);
        expect(res.errors.some(e => e.includes('Doublon'))).toBe(true);
        expect(res.errors.some(e => e.includes('Champ obligatoire manquant'))).toBe(true);
    });

    test('Pagination et filtres avancés', async () => {
        const res = await request(app).get('/formations/advanced-search?niveau=Débutant&limit=2&page=1');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(2);
        expect(res.body.pagination.page).toBe(1);
    });

    test('Paramètre invalide déclenche erreur 400', async () => {
        const res = await request(app).get('/formations/advanced-search?prixMax=-10');
        expect(res.status).toBe(400);
    });

    test('Supporte plusieurs requêtes simultanées', async () => {
        const promises = [];
        for (let i = 0; i < 50; i++) {
            promises.push(request(app).get('/formations'));
        }
        const results = await Promise.all(promises);
        results.forEach(res => {
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data || res.body)).toBe(true);
        });
    }, 20000);
});
