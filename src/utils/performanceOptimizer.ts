// Performance Optimization Utilities for Forward Horizon

interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  keyPrefix: string;
}

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  dataFetchTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  timestamp: number;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private metrics: PerformanceMetrics[] = [];
  private config: CacheConfig = {
    maxSize: 100,
    ttl: 5 * 60 * 1000, // 5 minutes
    keyPrefix: 'fh_'
  };

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Cache Management
  setCache(key: string, data: any, ttl?: number): void {
    const cacheKey = `${this.config.keyPrefix}${key}`;
    const timestamp = Date.now();
    const cacheTTL = ttl || this.config.ttl;

    // Clean up expired entries
    this.cleanupCache();

    // Check cache size limit
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(cacheKey, {
      data,
      timestamp,
      ttl: cacheTTL
    });
  }

  getCache(key: string): any | null {
    const cacheKey = `${this.config.keyPrefix}${key}`;
    const item = this.cache.get(cacheKey);

    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return item.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Data Prefetching
  async prefetchData(endpoints: string[]): Promise<void> {
    const prefetchPromises = endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        this.setCache(endpoint, data);
      } catch (error) {
        console.warn(`Failed to prefetch ${endpoint}:`, error);
      }
    });

    await Promise.allSettled(prefetchPromises);
  }

  // Lazy Loading
  createLazyLoader<T>(
    loader: () => Promise<T>,
    cacheKey: string
  ): () => Promise<T> {
    return async () => {
      // Check cache first
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      // Load data
      const data = await loader();
      this.setCache(cacheKey, data);
      return data;
    };
  }

  // Performance Monitoring
  startTimer(label: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    const metric: PerformanceMetrics = {
      loadTime: label.includes('load') ? value : 0,
      renderTime: label.includes('render') ? value : 0,
      dataFetchTime: label.includes('fetch') ? value : 0,
      cacheHitRate: this.calculateCacheHitRate(),
      memoryUsage: this.getMemoryUsage(),
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log performance issues
    if (value > 1000) { // More than 1 second
      console.warn(`Performance issue detected: ${label} took ${value.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {};

    const sums = this.metrics.reduce((acc, metric) => ({
      loadTime: acc.loadTime + metric.loadTime,
      renderTime: acc.renderTime + metric.renderTime,
      dataFetchTime: acc.dataFetchTime + metric.dataFetchTime,
      cacheHitRate: acc.cacheHitRate + metric.cacheHitRate,
      memoryUsage: acc.memoryUsage + metric.memoryUsage
    }), {
      loadTime: 0,
      renderTime: 0,
      dataFetchTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0
    });

    const count = this.metrics.length;
    return {
      loadTime: sums.loadTime / count,
      renderTime: sums.renderTime / count,
      dataFetchTime: sums.dataFetchTime / count,
      cacheHitRate: sums.cacheHitRate / count,
      memoryUsage: sums.memoryUsage / count
    };
  }

  private calculateCacheHitRate(): number {
    // This would be calculated based on actual cache usage
    return 0.85; // Placeholder
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  // Image Optimization
  optimizeImageUrl(url: string, width: number, height: number): string {
    // Add image optimization parameters
    const params = new URLSearchParams();
    params.append('w', width.toString());
    params.append('h', height.toString());
    params.append('q', '85'); // Quality
    params.append('fm', 'webp'); // Format

    return `${url}?${params.toString()}`;
  }

  // Bundle Optimization
  async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  async loadCSS(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
      document.head.appendChild(link);
    });
  }

  // Database Query Optimization
  createQueryOptimizer() {
    return {
      // Batch multiple queries
      batchQueries: async <T>(queries: (() => Promise<T>)[]): Promise<T[]> => {
        const results = await Promise.all(queries.map(query => query()));
        return results;
      },

      // Debounce frequent queries
      debounceQuery: <T>(
        queryFn: () => Promise<T>,
        delay: number = 300
      ): (() => Promise<T>) => {
        let timeoutId: NodeJS.Timeout;
        let cachedResult: T | null = null;

        return () => {
          return new Promise((resolve) => {
            clearTimeout(timeoutId);
            
            if (cachedResult) {
              resolve(cachedResult);
              return;
            }

            timeoutId = setTimeout(async () => {
              cachedResult = await queryFn();
              resolve(cachedResult);
            }, delay);
          });
        };
      },

      // Throttle expensive operations
      throttleQuery: <T>(
        queryFn: () => Promise<T>,
        limit: number = 100
      ): (() => Promise<T>) => {
        let lastCall = 0;
        let cachedResult: T | null = null;

        return () => {
          return new Promise((resolve) => {
            const now = Date.now();

            if (now - lastCall < limit) {
              if (cachedResult) {
                resolve(cachedResult);
                return;
              }
            }

            lastCall = now;
            queryFn().then(result => {
              cachedResult = result;
              resolve(result);
            });
          });
        };
      }
    };
  }

  // Component Optimization
  createComponentOptimizer() {
    return {
      // Memoize expensive computations
      memoize: <T extends (...args: any[]) => any>(
        fn: T,
        keyFn?: (...args: Parameters<T>) => string
      ): T => {
        const cache = new Map<string, ReturnType<T>>();

        return ((...args: Parameters<T>): ReturnType<T> => {
          const key = keyFn ? keyFn(...args) : JSON.stringify(args);
          
          if (cache.has(key)) {
            return cache.get(key)!;
          }

          const result = fn(...args);
          cache.set(key, result);
          return result;
        }) as T;
      },

      // Virtual scrolling for large lists
      createVirtualScroller: <T>(
        items: T[],
        itemHeight: number,
        containerHeight: number
      ) => {
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const totalHeight = items.length * itemHeight;

        return {
          getVisibleItems: (scrollTop: number) => {
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleCount, items.length);
            
            return {
              items: items.slice(startIndex, endIndex),
              startIndex,
              endIndex,
              offsetY: startIndex * itemHeight
            };
          },
          totalHeight
        };
      }
    };
  }

  // Network Optimization
  createNetworkOptimizer() {
    return {
      // Retry failed requests
      retryRequest: async <T>(
        requestFn: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 1000
      ): Promise<T> => {
        let lastError: Error;

        for (let i = 0; i < maxRetries; i++) {
          try {
            return await requestFn();
          } catch (error) {
            lastError = error as Error;
            
            if (i < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
          }
        }

        throw lastError!;
      },

      // Request deduplication
      deduplicateRequest: <T>(
        requestFn: () => Promise<T>,
        key: string
      ): (() => Promise<T>) => {
        const pendingRequests = new Map<string, Promise<T>>();

        return () => {
          if (pendingRequests.has(key)) {
            return pendingRequests.get(key)!;
          }

          const request = requestFn();
          pendingRequests.set(key, request);

          request.finally(() => {
            pendingRequests.delete(key);
          });

          return request;
        };
      }
    };
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Utility functions
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Performance monitoring hooks
export const usePerformanceMonitor = () => {
  const startTimer = (label: string) => {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      performanceOptimizer.recordMetric(label, duration);
    };
  };

  return { startTimer };
};

// Export types
export type { CacheConfig, PerformanceMetrics }; 