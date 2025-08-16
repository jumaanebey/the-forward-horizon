import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

// GET /api/analytics - Get comprehensive analytics data
export async function GET(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-analytics-get');
  
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const type = searchParams.get('type') || 'all';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Check cache first
    const cacheKey = `analytics-${period}-${type}`;
    const cached = performanceOptimizer.getCache(cacheKey);
    if (cached) {
      timer();
      return NextResponse.json(cached);
    }

    let analytics = {};

    // If Supabase is not configured, return mock data
    if (!supabase) {
      analytics = {
        residents: {
          total: 12,
          active: 10,
          occupancyRate: 83.3,
          recentAdmissions: 3,
          averageAge: 42,
          programDistribution: {
            'veterans': 4,
            'recovery': 5,
            'reentry': 3
          }
        },
        financial: {
          totalRevenue: 45000,
          collectedRevenue: 42000,
          pendingRevenue: 3000,
          overdueRevenue: 500,
          collectionRate: 93.3,
          paymentTypeDistribution: {
            'rent': 15,
            'deposit': 8,
            'fee': 3
          },
          monthlyRevenue: {
            'Jan 2025': 8500,
            'Feb 2025': 8200,
            'Mar 2025': 8800
          }
        },
        operations: {
          totalEvents: 24,
          completedEvents: 22,
          upcomingEvents: 2,
          completionRate: 91.7,
          eventTypeDistribution: {
            'group_meeting': 8,
            'individual_session': 12,
            'house_meeting': 4
          }
        },
        maintenance: {
          totalRequests: 8,
          pendingRequests: 2,
          completedRequests: 6,
          urgentRequests: 1,
          completionRate: 75.0,
          priorityDistribution: {
            'low': 3,
            'medium': 4,
            'high': 1
          }
        }
      };
    } else {
      // Real Supabase queries would go here
      // For now, return the same mock data structure
      analytics = {
        residents: {
          total: 12,
          active: 10,
          occupancyRate: 83.3,
          recentAdmissions: 3,
          averageAge: 42,
          programDistribution: {
            'veterans': 4,
            'recovery': 5,
            'reentry': 3
          }
        },
        financial: {
          totalRevenue: 45000,
          collectedRevenue: 42000,
          pendingRevenue: 3000,
          overdueRevenue: 500,
          collectionRate: 93.3,
          paymentTypeDistribution: {
            'rent': 15,
            'deposit': 8,
            'fee': 3
          },
          monthlyRevenue: {
            'Jan 2025': 8500,
            'Feb 2025': 8200,
            'Mar 2025': 8800
          }
        },
        operations: {
          totalEvents: 24,
          completedEvents: 22,
          upcomingEvents: 2,
          completionRate: 91.7,
          eventTypeDistribution: {
            'group_meeting': 8,
            'individual_session': 12,
            'house_meeting': 4
          }
        },
        maintenance: {
          totalRequests: 8,
          pendingRequests: 2,
          completedRequests: 6,
          urgentRequests: 1,
          completionRate: 75.0,
          priorityDistribution: {
            'low': 3,
            'medium': 4,
            'high': 1
          }
        }
      };
    }

    // Cache the results
    performanceOptimizer.setCache(cacheKey, analytics, 10 * 60 * 1000); // 10 minutes

    timer();

    return NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...analytics
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 