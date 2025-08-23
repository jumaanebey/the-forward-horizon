// API Client for Forward Horizon
import { performanceOptimizer } from './performanceOptimizer';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  cacheTTL?: number;
  retries?: number;
  timeout?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private requestQueue: Map<string, Promise<any>> = new Map();

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Clear authentication token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Main request method
  async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const timer = performanceOptimizer.startTimer(`api-${config.method || 'GET'}-${endpoint}`);
    
    const {
      method = 'GET',
      headers = {},
      body,
      cache = false,
      cacheTTL = 5 * 60 * 1000, // 5 minutes
      retries = 3,
      timeout = 10000 // 10 seconds
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${method}-${url}-${JSON.stringify(body || {})}`;

    // Check cache for GET requests
    if (method === 'GET' && cache) {
      const cached = performanceOptimizer.getCache(cacheKey);
      if (cached) {
        timer();
        return cached;
      }
    }

    // Check for duplicate requests
    if (this.requestQueue.has(cacheKey)) {
      const result = await this.requestQueue.get(cacheKey);
      timer();
      return result;
    }

    // Create request promise
    const requestPromise = this.executeRequest<T>(url, {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      body,
      cache,
      cacheTTL,
      retries,
      timeout
    });

    // Store in queue to prevent duplicates
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      timer();
      return result;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  private async executeRequest<T>(
    url: string,
    config: ApiRequestConfig & { headers: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const { method, headers, body, cache, cacheTTL, retries, timeout } = config;

    let lastError: Error;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET responses
        if (method === 'GET' && cache) {
          performanceOptimizer.setCache(url, data, cacheTTL);
        }

        return data;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('HTTP 4')) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError!;
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  async put<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  async delete<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Specific API methods for Forward Horizon
  // Residents
  async getResidents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    program?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    const endpoint = `/residents${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get(endpoint, { cache: true });
  }

  async getResident(id: number) {
    return this.get(`/residents/${id}`, { cache: true });
  }

  async createResident(data: any) {
    return this.post('/residents', data);
  }

  async updateResident(id: number, data: any) {
    return this.put(`/residents/${id}`, data);
  }

  async deleteResident(id: number) {
    return this.delete(`/residents/${id}`);
  }

  async bulkUpdateResidents(operation: 'update' | 'delete', ids: number[], data?: any) {
    return this.put('/residents', { operation, ids, data });
  }

  // Payments
  async getPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    residentId?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    const endpoint = `/payments${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get(endpoint, { cache: true });
  }

  async createPayment(data: any) {
    return this.post('/payments', data);
  }

  async bulkUpdatePayments(operation: 'markAsPaid' | 'updateStatus' | 'delete', ids: number[], data?: any) {
    return this.put('/payments', { operation, ids, data });
  }

  // Analytics
  async getAnalytics(params?: {
    period?: number;
    type?: 'all' | 'residents' | 'financial' | 'operations' | 'inventory';
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    const endpoint = `/analytics${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get(endpoint, { cache: true, cacheTTL: 10 * 60 * 1000 }); // 10 minutes
  }

  // Health Check
  async getHealth(detailed?: boolean) {
    if (detailed) {
      return this.post('/health', { detailed: true });
    }
    return this.get('/health');
  }

  // Schedule Events
  async getScheduleEvents(params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
    residentId?: number;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    const endpoint = `/schedule${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get(endpoint, { cache: true });
  }

  async createScheduleEvent(data: any) {
    return this.post('/schedule', data);
  }

  // Maintenance
  async getMaintenanceRequests(params?: {
    status?: string;
    priority?: string;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    const endpoint = `/maintenance${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get(endpoint, { cache: true });
  }

  async createMaintenanceRequest(data: any) {
    return this.post('/maintenance', data);
  }

  // Inventory
  async getInventoryItems(params?: {
    category?: string;
    status?: string;
    lowStock?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });
    
    const endpoint = `/inventory${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get(endpoint, { cache: true });
  }

  async createInventoryItem(data: any) {
    return this.post('/inventory', data);
  }

  // Error handling utility
  handleError(error: any): ApiResponse {
    if (error instanceof Error) {
      return {
        error: error.message
      };
    }
    
    return {
      error: 'An unexpected error occurred'
    };
  }

  // Clear all caches
  clearCache() {
    performanceOptimizer.clearCache();
  }

  // Prefetch critical data
  async prefetchCriticalData() {
    const prefetchPromises = [
      this.getResidents({ limit: 10 }),
      this.getAnalytics({ period: 30 }),
      this.getHealth()
    ];

    await Promise.allSettled(prefetchPromises);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse, ApiRequestConfig }; 