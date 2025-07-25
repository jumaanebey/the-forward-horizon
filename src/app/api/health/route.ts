import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

// GET /api/health - System health check
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: { status: 'unknown', responseTime: 0 },
        cache: { status: 'unknown', hitRate: 0 },
        memory: { status: 'unknown', usage: 0 },
        performance: { status: 'unknown', averageResponseTime: 0 }
      }
    };

    // Database health check
    const dbStartTime = Date.now();
    try {
      const { data, error } = await supabase
        .from('residents')
        .select('count', { count: 'exact', head: true });

      const dbResponseTime = Date.now() - dbStartTime;
      health.checks.database = {
        status: error ? 'unhealthy' : 'healthy',
        responseTime: dbResponseTime,
        error: error?.message
      };
    } catch (error) {
      health.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - dbStartTime,
        error: 'Database connection failed'
      };
    }

    // Cache health check
    try {
      const cacheMetrics = performanceOptimizer.getAverageMetrics();
      health.checks.cache = {
        status: 'healthy',
        hitRate: (cacheMetrics.cacheHitRate || 0) * 100,
        size: 0 // Would be implemented in a real cache system
      };
    } catch (error) {
      health.checks.cache = {
        status: 'unhealthy',
        hitRate: 0,
        error: 'Cache system unavailable'
      };
    }

    // Memory health check
    try {
      const memoryUsage = process.memoryUsage();
      const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
      const maxMemoryMB = memoryUsage.heapTotal / 1024 / 1024;
      const memoryPercentage = (memoryUsageMB / maxMemoryMB) * 100;

      health.checks.memory = {
        status: memoryPercentage > 90 ? 'warning' : 'healthy',
        usage: Math.round(memoryPercentage),
        used: Math.round(memoryUsageMB),
        total: Math.round(maxMemoryMB)
      };
    } catch (error) {
      health.checks.memory = {
        status: 'unknown',
        usage: 0,
        error: 'Memory metrics unavailable'
      };
    }

    // Performance health check
    try {
      const performanceMetrics = performanceOptimizer.getAverageMetrics();
      const avgResponseTime = performanceMetrics.loadTime || 0;

      health.checks.performance = {
        status: avgResponseTime > 1000 ? 'warning' : 'healthy',
        averageResponseTime: Math.round(avgResponseTime),
        totalRequests: performanceOptimizer.getMetrics().length
      };
    } catch (error) {
      health.checks.performance = {
        status: 'unknown',
        averageResponseTime: 0,
        error: 'Performance metrics unavailable'
      };
    }

    // Determine overall status
    const unhealthyChecks = Object.values(health.checks).filter(check => check.status === 'unhealthy');
    const warningChecks = Object.values(health.checks).filter(check => check.status === 'warning');

    if (unhealthyChecks.length > 0) {
      health.status = 'unhealthy';
    } else if (warningChecks.length > 0) {
      health.status = 'degraded';
    }

    const totalResponseTime = Date.now() - startTime;
    health.responseTime = totalResponseTime;

    // Set appropriate status code
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: Date.now() - startTime
    }, { status: 503 });
  }
}

// POST /api/health - Trigger health check and return detailed report
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { detailed = false } = body;

    const health = await GET(request as any);
    const healthData = await health.json();

    if (detailed) {
      // Add detailed system information
      const detailedHealth = {
        ...healthData,
        system: {
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
          pid: process.pid,
          title: process.title
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
          VERCEL_REGION: process.env.VERCEL_REGION
        },
        performance: {
          metrics: performanceOptimizer.getMetrics().slice(-10), // Last 10 metrics
          cacheStats: {
            size: 0, // Would be implemented in a real cache system
            keys: []
          }
        }
      };

      return NextResponse.json(detailedHealth, { status: health.status });
    }

    return health;

  } catch (error) {
    console.error('Detailed health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed',
      responseTime: Date.now() - startTime
    }, { status: 503 });
  }
} 