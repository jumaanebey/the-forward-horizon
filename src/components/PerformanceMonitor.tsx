"use client";
import { useState, useEffect } from "react";
import { performanceOptimizer, PerformanceMetrics } from "../utils/performanceOptimizer";

interface PerformanceMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PerformanceMonitor({ isOpen, onClose }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [averageMetrics, setAverageMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    hitRate: 0,
    missRate: 0
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'optimization' | 'cache'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isOpen) {
      updateMetrics();
      
      if (autoRefresh) {
        const interval = setInterval(updateMetrics, 2000);
        return () => clearInterval(interval);
      }
    }
  }, [isOpen, autoRefresh]);

  const updateMetrics = () => {
    const currentMetrics = performanceOptimizer.getMetrics();
    const currentAverage = performanceOptimizer.getAverageMetrics();
    
    setMetrics(currentMetrics);
    setAverageMetrics(currentAverage);
    
    // Simulate cache stats (in real implementation, these would come from the optimizer)
    setCacheStats({
      size: Math.floor(Math.random() * 50) + 20,
      hitRate: 0.85 + Math.random() * 0.1,
      missRate: 0.15 - Math.random() * 0.1
    });
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value <= threshold * 0.5) return 'text-green-600';
    if (value <= threshold) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceStatus = (value: number, threshold: number) => {
    if (value <= threshold * 0.5) return 'Excellent';
    if (value <= threshold) return 'Good';
    return 'Needs Attention';
  };

  const clearMetrics = () => {
    performanceOptimizer.clearCache();
    updateMetrics();
  };

  const optimizePerformance = () => {
    // Simulate performance optimization
    performanceOptimizer.prefetchData(['/api/residents', '/api/payments']);
    updateMetrics();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'metrics', label: 'Metrics', icon: '📈' },
    { id: 'optimization', label: 'Optimization', icon: '⚡' },
    { id: 'cache', label: 'Cache', icon: '💾' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Monitor</h2>
            <p className="text-gray-600">Real-time performance metrics and optimization</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Auto Refresh</span>
            </label>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Load Time</p>
                      <p className={`text-2xl font-bold ${getPerformanceColor(averageMetrics.loadTime || 0, 1000)}`}>
                        {(averageMetrics.loadTime || 0).toFixed(0)}ms
                      </p>
                    </div>
                    <div className="text-3xl">⚡</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPerformanceStatus(averageMetrics.loadTime || 0, 1000)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Render Time</p>
                      <p className={`text-2xl font-bold ${getPerformanceColor(averageMetrics.renderTime || 0, 500)}`}>
                        {(averageMetrics.renderTime || 0).toFixed(0)}ms
                      </p>
                    </div>
                    <div className="text-3xl">🎨</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPerformanceStatus(averageMetrics.renderTime || 0, 500)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Data Fetch</p>
                      <p className={`text-2xl font-bold ${getPerformanceColor(averageMetrics.dataFetchTime || 0, 800)}`}>
                        {(averageMetrics.dataFetchTime || 0).toFixed(0)}ms
                      </p>
                    </div>
                    <div className="text-3xl">📡</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPerformanceStatus(averageMetrics.dataFetchTime || 0, 800)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Cache Hit Rate</p>
                      <p className={`text-2xl font-bold ${getPerformanceColor((averageMetrics.cacheHitRate || 0) * 100, 80)}`}>
                        {((averageMetrics.cacheHitRate || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-3xl">💾</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPerformanceStatus((averageMetrics.cacheHitRate || 0) * 100, 80)}
                  </p>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Memory Usage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used Memory</span>
                    <span className="font-medium">{(averageMetrics.memoryUsage || 0).toFixed(1)} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((averageMetrics.memoryUsage || 0) / 100 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Memory usage is {(averageMetrics.memoryUsage || 0) > 50 ? 'high' : 'normal'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button
                  onClick={optimizePerformance}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Optimize Performance
                </button>
                <button
                  onClick={clearMetrics}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear Cache
                </button>
                <button
                  onClick={updateMetrics}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Refresh Metrics
                </button>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Performance Metrics</h3>
              
              {metrics.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No metrics available. Start using the application to collect performance data.
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.slice(-10).reverse().map((metric, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Load Time:</span>
                          <span className={`ml-2 font-medium ${getPerformanceColor(metric.loadTime, 1000)}`}>
                            {metric.loadTime.toFixed(0)}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Render Time:</span>
                          <span className={`ml-2 font-medium ${getPerformanceColor(metric.renderTime, 500)}`}>
                            {metric.renderTime.toFixed(0)}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Data Fetch:</span>
                          <span className={`ml-2 font-medium ${getPerformanceColor(metric.dataFetchTime, 800)}`}>
                            {metric.dataFetchTime.toFixed(0)}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cache Hit:</span>
                          <span className={`ml-2 font-medium ${getPerformanceColor(metric.cacheHitRate * 100, 80)}`}>
                            {(metric.cacheHitRate * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(metric.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Optimization</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Optimization Recommendations */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                  <div className="space-y-3">
                    {(averageMetrics.loadTime || 0) > 1000 && (
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500">⚠️</span>
                        <div>
                          <p className="text-sm font-medium text-red-700">High Load Time</p>
                          <p className="text-xs text-gray-600">Consider implementing code splitting and lazy loading</p>
                        </div>
                      </div>
                    )}
                    
                    {(averageMetrics.renderTime || 0) > 500 && (
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-500">⚠️</span>
                        <div>
                          <p className="text-sm font-medium text-yellow-700">Slow Rendering</p>
                          <p className="text-xs text-gray-600">Optimize component rendering with React.memo</p>
                        </div>
                      </div>
                    )}
                    
                    {(averageMetrics.cacheHitRate || 0) < 0.8 && (
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <p className="text-sm font-medium text-blue-700">Low Cache Hit Rate</p>
                          <p className="text-xs text-gray-600">Implement better caching strategies</p>
                        </div>
                      </div>
                    )}
                    
                    {(averageMetrics.memoryUsage || 0) > 50 && (
                      <div className="flex items-start space-x-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <p className="text-sm font-medium text-orange-700">High Memory Usage</p>
                          <p className="text-xs text-gray-600">Check for memory leaks and optimize data structures</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Optimization Actions */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => performanceOptimizer.prefetchData(['/api/residents', '/api/payments'])}
                      className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    >
                      Prefetch Critical Data
                    </button>
                    <button
                      onClick={() => performanceOptimizer.clearCache()}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Clear All Caches
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                    >
                      Force Reload
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance Tips */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Performance Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use React.memo for expensive components</li>
                  <li>• Implement virtual scrolling for large lists</li>
                  <li>• Optimize images and use WebP format</li>
                  <li>• Enable gzip compression on your server</li>
                  <li>• Use CDN for static assets</li>
                  <li>• Implement proper error boundaries</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'cache' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Cache Management</h3>
              
              {/* Cache Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{cacheStats.size}</div>
                    <div className="text-sm text-gray-600">Cache Entries</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{(cacheStats.hitRate * 100).toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Hit Rate</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{(cacheStats.missRate * 100).toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Miss Rate</div>
                  </div>
                </div>
              </div>

              {/* Cache Configuration */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Cache Configuration</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Max Cache Size</span>
                    <span className="text-sm font-medium">100 entries</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">TTL (Time to Live)</span>
                    <span className="text-sm font-medium">5 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cache Prefix</span>
                    <span className="text-sm font-medium">fh_</span>
                  </div>
                </div>
              </div>

              {/* Cache Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => performanceOptimizer.clearCache()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Clear All Cache
                </button>
                <button
                  onClick={() => performanceOptimizer.prefetchData(['/api/residents'])}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Prefetch Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 