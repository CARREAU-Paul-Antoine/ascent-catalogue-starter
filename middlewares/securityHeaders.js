import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

/**
 * Configuration Helmet pour les headers de sécurité HTTP
 */
export function configureHelmet() {
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"]
            }
        },
        crossOriginEmbedderPolicy: false, // Peut être activé selon les besoins
        crossOriginResourcePolicy: { policy: "cross-origin" }
    });
}

/**
 * Configuration CORS sécurisée
 * À adapter selon tes besoins en production
 */
export function configureCORS() {
    const allowedOrigins = process.env.NODE_ENV === 'production'
        ? ['https://ton-domaine.com'] // Remplacer par tes domaines autorisés
        : ['http://localhost:3000', 'http://localhost:4200']; // Dev

    return cors({
        origin: function (origin, callback) {
            // Autoriser les requêtes sans origin (ex: mobile apps, Postman)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Non autorisé par CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 86400 // 24 heures
    });
}

/**
 * Rate limiting pour prévenir les attaques par force brute
 */
export function configureRateLimit() {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Max 100 requêtes par IP
        message: {
            success: false,
            error: 'Trop de requêtes, veuillez réessayer plus tard'
        },
        standardHeaders: true,
        legacyHeaders: false
    });
}
