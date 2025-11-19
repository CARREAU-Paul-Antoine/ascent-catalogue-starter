import cache from '../src/cache.js';

export function getCacheMetricsController(req, res) {
    // Récupérer les métriques du cache
    const metrics = cache.getCacheMetrics();

    res.json({
        success: true,
        metrics
    });
}
