import express from 'express';
import { PORT_LISTEN } from '../config/network.js';
import formationRoutes from '../routes/formationRoutes.js';
import { errorHandler, notFoundHandler } from '../middlewares/errorHandler.js';
import { configureHelmet, configureCORS, configureRateLimit } from '../middlewares/securityHeaders.js';
import { setupSwagger } from './swagger.js';

const app = express();
setupSwagger(app);
const PORT = PORT_LISTEN || 4200;

// ============================================
// SÉCURITÉ : Headers HTTP et protections
// ============================================

// 1. Helmet : Headers de sécurité HTTP
app.use(configureHelmet());

// 2. CORS sécurisé : Restreindre les origines autorisées
app.use(configureCORS());

// 3. Rate limiting : Prévention attaques par force brute
app.use(configureRateLimit());

// 4. Désactiver le header X-Powered-By pour éviter fingerprinting
app.disable('x-powered-by');

// ============================================
// MIDDLEWARES DE BASE
// ============================================

// Parser JSON avec limite de taille
app.use(express.json({ limit: '10kb' }));

// Parser URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// ROUTES
// ============================================

// Routes formations
app.use('/formations', formationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================
// GESTION D'ERREURS
// ============================================

// Route 404 : doit être avant le middleware d'erreur global
app.use(notFoundHandler);

// Middleware de gestion d'erreurs global
app.use(errorHandler);

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Sécurité: Helmet, CORS, Rate Limiting activés`);
    console.log('Documentation API disponible sur http://localhost:4200/api-docs');
});
