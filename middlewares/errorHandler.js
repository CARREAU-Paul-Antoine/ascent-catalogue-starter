/**
 * Middleware de gestion d'erreurs global
 * Ne pas exposer les détails techniques en production
 */
export function errorHandler(err, req, res, next) {
    // Log l'erreur complète pour le débogage (côté serveur uniquement)
    console.error('Erreur détectée:', {
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Déterminer le code d'erreur
    const statusCode = err.statusCode || 500;

    // Réponse sécurisée au client
    if (process.env.NODE_ENV === 'production') {
        // En production : message générique sans détails techniques
        res.status(statusCode).json({
            success: false,
            error: statusCode === 500
                ? 'Une erreur interne est survenue'
                : err.message || 'Erreur lors du traitement de la requête'
        });
    } else {
        // En développement : détails complets pour le débogage
        res.status(statusCode).json({
            success: false,
            error: err.message,
            stack: err.stack,
            details: err.details || undefined
        });
    }
}

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée'
    });
}
