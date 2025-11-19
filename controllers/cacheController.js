import * as cache from '../src/cache.js';

export function getCacheMetricsController(req, res) {
    const metrics = cache.getCacheMetrics();
    res.json({
        success: true,
        metrics
    });
}
