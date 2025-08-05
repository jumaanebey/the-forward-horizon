// Enhanced API Client for Forward Horizon Platform
// Centralized API management with type safety and error handling

import { supabase } from '../../lib/supabase';

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Enhanced Resident Interface
export interface EnhancedResident {
  id: string;
  resident_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender?: string;
  program_type: string;
  admission_date: string;
  status: 'active' | 'graduated' | 'discharged' | 'suspended' | 'awol';
  case_manager_id?: string;
  risk_score: number;
  current_room?: {
    id: string;
    room_number: string;
    house_name: string;
  };
  case_manager?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  recent_notes_count: number;
  payment_status: 'current' | 'late' | 'delinquent';
  program_progress: number; // percentage
}

// Analytics Interfaces
export interface AnalyticsData {
  occupancyRate: {
    current: number;
    trend: number;
    history: Array<{ month: string; rate: number }>;
  };
  financialMetrics: {
    revenue: { current: number; trend: number };
    expenses: { current: number; trend: number };
    profitMargin: { current: number; trend: number };
  };
  residentMetrics: {
    totalResidents: number;
    newAdmissions: number;
    graduations: number;
    averageStay: number;
    successRate: number;
  };
  programEffectiveness: {
    counselingAttendance: number;
    jobPlacementRate: number;
    relapsePrevention: number;
    communityIntegration: number;
  };
}

// AI Prediction Interfaces
export interface SuccessPrediction {
  residentId: string;
  residentName: string;
  successProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  keyFactors: string[];
  recommendations: string[];
  confidenceScore: number;
  timeToGraduation: number;
  interventionNeeded: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          message: data.message,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Residents API
  residents = {
    // Get all residents with filters and pagination
    getAll: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      program_type?: string;
      house_id?: string;
      search?: string;
    }): Promise<PaginatedResponse<EnhancedResident>> => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      
      return this.request(`/residents?${searchParams.toString()}`);
    },

    // Get single resident with full details
    getById: async (id: string): Promise<ApiResponse<EnhancedResident>> => {
      return this.request(`/residents/${id}`);
    },

    // Create new resident
    create: async (resident: Partial<EnhancedResident>): Promise<ApiResponse<EnhancedResident>> => {
      return this.request('/residents', {
        method: 'POST',
        body: JSON.stringify(resident),
      });
    },

    // Update resident
    update: async (id: string, updates: Partial<EnhancedResident>): Promise<ApiResponse<EnhancedResident>> => {
      return this.request(`/residents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    // Update resident status
    updateStatus: async (id: string, status: string, reason?: string): Promise<ApiResponse> => {
      return this.request(`/residents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason }),
      });
    },

    // Get resident case notes
    getCaseNotes: async (id: string, limit = 10): Promise<ApiResponse<any[]>> => {
      return this.request(`/residents/${id}/case-notes?limit=${limit}`);
    },

    // Add case note
    addCaseNote: async (residentId: string, note: {
      title: string;
      content: string;
      note_type: string;
      tags?: string[];
    }): Promise<ApiResponse> => {
      return this.request(`/residents/${residentId}/case-notes`, {
        method: 'POST',
        body: JSON.stringify(note),
      });
    },

    // Get resident payments
    getPayments: async (id: string): Promise<ApiResponse<any[]>> => {
      return this.request(`/residents/${id}/payments`);
    },

    // Add payment
    addPayment: async (residentId: string, payment: {
      amount: number;
      payment_type: string;
      payment_method: string;
      due_date?: string;
    }): Promise<ApiResponse> => {
      return this.request(`/residents/${residentId}/payments`, {
        method: 'POST',
        body: JSON.stringify(payment),
      });
    },
  };

  // Analytics API
  analytics = {
    // Get comprehensive analytics data
    getDashboardData: async (period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<AnalyticsData>> => {
      return this.request(`/analytics/dashboard?period=${period}`);
    },

    // Get occupancy trends
    getOccupancyTrends: async (period: string): Promise<ApiResponse<any[]>> => {
      return this.request(`/analytics/occupancy-trends?period=${period}`);
    },

    // Get financial metrics
    getFinancialMetrics: async (period: string): Promise<ApiResponse<any>> => {
      return this.request(`/analytics/financial-metrics?period=${period}`);
    },

    // Get program effectiveness metrics
    getProgramEffectiveness: async (): Promise<ApiResponse<any>> => {
      return this.request('/analytics/program-effectiveness');
    },

    // Export analytics data
    exportData: async (type: string, period: string): Promise<ApiResponse<string>> => {
      return this.request(`/analytics/export?type=${type}&period=${period}`);
    },
  };

  // AI Insights API
  aiInsights = {
    // Get success predictions for all residents
    getSuccessPredictions: async (): Promise<ApiResponse<SuccessPrediction[]>> => {
      return this.request('/ai/success-predictions');
    },

    // Get success prediction for specific resident
    getResidentPrediction: async (residentId: string): Promise<ApiResponse<SuccessPrediction>> => {
      return this.request(`/ai/success-predictions/${residentId}`);
    },

    // Generate new predictions
    generatePredictions: async (residentIds?: string[]): Promise<ApiResponse> => {
      return this.request('/ai/generate-predictions', {
        method: 'POST',
        body: JSON.stringify({ residentIds }),
      });
    },

    // Get risk assessment for resident
    getRiskAssessment: async (residentId: string): Promise<ApiResponse<any>> => {
      return this.request(`/ai/risk-assessment/${residentId}`);
    },
  };

  // Workflows API
  workflows = {
    // Get all workflows
    getAll: async (): Promise<ApiResponse<any[]>> => {
      return this.request('/workflows');
    },

    // Get workflow by ID
    getById: async (id: string): Promise<ApiResponse<any>> => {
      return this.request(`/workflows/${id}`);
    },

    // Create workflow
    create: async (workflow: {
      name: string;
      description: string;
      workflow_type: string;
      trigger_config: any;
      steps: any[];
    }): Promise<ApiResponse<any>> => {
      return this.request('/workflows', {
        method: 'POST',
        body: JSON.stringify(workflow),
      });
    },

    // Update workflow
    update: async (id: string, updates: any): Promise<ApiResponse<any>> => {
      return this.request(`/workflows/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    // Toggle workflow status
    toggleStatus: async (id: string): Promise<ApiResponse> => {
      return this.request(`/workflows/${id}/toggle`, {
        method: 'PATCH',
      });
    },

    // Execute workflow manually
    execute: async (id: string, residentId?: string): Promise<ApiResponse> => {
      return this.request(`/workflows/${id}/execute`, {
        method: 'POST',
        body: JSON.stringify({ residentId }),
      });
    },

    // Get workflow executions
    getExecutions: async (workflowId: string, limit = 50): Promise<ApiResponse<any[]>> => {
      return this.request(`/workflows/${workflowId}/executions?limit=${limit}`);
    },
  };

  // Housing API
  housing = {
    // Get all houses with occupancy data
    getHouses: async (): Promise<ApiResponse<any[]>> => {
      return this.request('/housing/houses');
    },

    // Get rooms with occupancy
    getRooms: async (houseId?: string): Promise<ApiResponse<any[]>> => {
      const endpoint = houseId ? `/housing/rooms?house_id=${houseId}` : '/housing/rooms';
      return this.request(endpoint);
    },

    // Update room status
    updateRoomStatus: async (roomId: string, status: string): Promise<ApiResponse> => {
      return this.request(`/housing/rooms/${roomId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    // Assign resident to room
    assignRoom: async (roomId: string, residentId: string, bedNumber: number): Promise<ApiResponse> => {
      return this.request(`/housing/rooms/${roomId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ residentId, bedNumber }),
      });
    },

    // Get waitlist
    getWaitlist: async (): Promise<ApiResponse<any[]>> => {
      return this.request('/housing/waitlist');
    },

    // Add to waitlist
    addToWaitlist: async (entry: {
      first_name: string;
      last_name: string;
      email?: string;
      phone?: string;
      program_type: string;
      special_needs?: string[];
    }): Promise<ApiResponse> => {
      return this.request('/housing/waitlist', {
        method: 'POST',
        body: JSON.stringify(entry),
      });
    },
  };

  // Staff API
  staff = {
    // Get all staff
    getAll: async (): Promise<ApiResponse<any[]>> => {
      return this.request('/staff');
    },

    // Get staff by ID
    getById: async (id: string): Promise<ApiResponse<any>> => {
      return this.request(`/staff/${id}`);
    },

    // Create staff member
    create: async (staff: any): Promise<ApiResponse<any>> => {
      return this.request('/staff', {
        method: 'POST',
        body: JSON.stringify(staff),
      });
    },

    // Update staff member
    update: async (id: string, updates: any): Promise<ApiResponse<any>> => {
      return this.request(`/staff/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    // Get staff caseload
    getCaseload: async (staffId: string): Promise<ApiResponse<any[]>> => {
      return this.request(`/staff/${staffId}/caseload`);
    },
  };

  // Calendar API
  calendar = {
    // Get events for a date range
    getEvents: async (startDate: string, endDate: string): Promise<ApiResponse<any[]>> => {
      return this.request(`/calendar/events?start=${startDate}&end=${endDate}`);
    },

    // Create event
    createEvent: async (event: {
      title: string;
      description?: string;
      event_type: string;
      start_time: string;
      end_time: string;
      location?: string;
      residents?: string[];
      staff_members?: string[];
    }): Promise<ApiResponse<any>> => {
      return this.request('/calendar/events', {
        method: 'POST',
        body: JSON.stringify(event),
      });
    },

    // Update event
    updateEvent: async (id: string, updates: any): Promise<ApiResponse<any>> => {
      return this.request(`/calendar/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    // Update event status
    updateEventStatus: async (id: string, status: string, notes?: string): Promise<ApiResponse> => {
      return this.request(`/calendar/events/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, completion_notes: notes }),
      });
    },
  };

  // Documents API
  documents = {
    // Get documents for resident
    getByResident: async (residentId: string): Promise<ApiResponse<any[]>> => {
      return this.request(`/documents?resident_id=${residentId}`);
    },

    // Upload document
    upload: async (file: File, metadata: {
      resident_id?: string;
      document_type: string;
      title: string;
      description?: string;
      is_confidential?: boolean;
    }): Promise<ApiResponse<any>> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch(`${this.baseUrl}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      return response.json();
    },

    // Delete document
    delete: async (id: string): Promise<ApiResponse> => {
      return this.request(`/documents/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // Reports API
  reports = {
    // Generate standard reports
    generate: async (reportType: string, params: any): Promise<ApiResponse<any>> => {
      return this.request('/reports/generate', {
        method: 'POST',
        body: JSON.stringify({ reportType, params }),
      });
    },

    // Get available report types
    getTypes: async (): Promise<ApiResponse<any[]>> => {
      return this.request('/reports/types');
    },

    // Export report
    export: async (reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<ApiResponse<string>> => {
      return this.request(`/reports/${reportId}/export?format=${format}`);
    },
  };
}

// Create singleton instance
export const apiClient = new ApiClient();

// Utility functions for API error handling
export const handleApiError = (response: ApiResponse): string => {
  return response.error || 'An unexpected error occurred';
};

export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } => {
  return response.success && response.data !== undefined;
};

// React hook for API state management
import { useState, useEffect } from 'react';

export function useApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiCall();
        
        if (isMounted) {
          if (response.success && response.data) {
            setData(response.data);
          } else {
            setError(response.error || 'Failed to fetch data');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Network error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Re-trigger useEffect
  };

  return { data, loading, error, refetch };
}

export default apiClient;