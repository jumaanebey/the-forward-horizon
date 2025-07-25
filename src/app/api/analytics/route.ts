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

    if (type === 'all' || type === 'residents') {
      // Resident analytics
      const { data: residents, error: residentsError } = await supabase
        .from('residents')
        .select('*');

      if (!residentsError && residents) {
        const totalResidents = residents.length;
        const activeResidents = residents.filter(r => r.status === 'active').length;
        const recentAdmissions = residents.filter(r => 
          new Date(r.admission_date) >= startDate
        ).length;

        // Calculate average age
        const ages = residents
          .filter(r => r.dob)
          .map(r => {
            const birthDate = new Date(r.dob);
            const age = endDate.getFullYear() - birthDate.getFullYear();
            return age;
          });
        const averageAge = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0;

        // Program distribution
        const programDistribution = residents.reduce((acc, resident) => {
          const program = resident.program || 'Unknown';
          acc[program] = (acc[program] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        analytics = {
          ...analytics,
          residents: {
            total: totalResidents,
            active: activeResidents,
            occupancyRate: totalResidents / 20 * 100, // Assuming 20 rooms
            recentAdmissions,
            averageAge: Math.round(averageAge),
            programDistribution
          }
        };
      }
    }

    if (type === 'all' || type === 'financial') {
      // Financial analytics
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (!paymentsError && payments) {
        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const collectedRevenue = payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        const pendingRevenue = payments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        const overdueRevenue = payments
          .filter(p => p.status === 'pending' && new Date(p.due_date) < new Date())
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        // Payment type distribution
        const paymentTypeDistribution = payments.reduce((acc, payment) => {
          const type = payment.type || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Monthly revenue trend
        const monthlyRevenue = {};
        payments.forEach(payment => {
          const month = new Date(payment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (payment.amount || 0);
        });

        analytics = {
          ...analytics,
          financial: {
            totalRevenue,
            collectedRevenue,
            pendingRevenue,
            overdueRevenue,
            collectionRate: totalRevenue > 0 ? (collectedRevenue / totalRevenue) * 100 : 0,
            paymentTypeDistribution,
            monthlyRevenue
          }
        };
      }
    }

    if (type === 'all' || type === 'operations') {
      // Operations analytics
      const { data: events, error: eventsError } = await supabase
        .from('schedule_events')
        .select('*')
        .gte('start_time', startDate.toISOString());

      if (!eventsError && events) {
        const totalEvents = events.length;
        const completedEvents = events.filter(e => e.status === 'completed').length;
        const upcomingEvents = events.filter(e => e.status === 'scheduled' && new Date(e.start_time) > new Date()).length;

        // Event type distribution
        const eventTypeDistribution = events.reduce((acc, event) => {
          const type = event.type || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        analytics = {
          ...analytics,
          operations: {
            totalEvents,
            completedEvents,
            upcomingEvents,
            completionRate: totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0,
            eventTypeDistribution
          }
        };
      }

      // Maintenance analytics
      const { data: maintenance, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (!maintenanceError && maintenance) {
        const totalRequests = maintenance.length;
        const pendingRequests = maintenance.filter(m => m.status === 'pending').length;
        const completedRequests = maintenance.filter(m => m.status === 'completed').length;
        const urgentRequests = maintenance.filter(m => m.priority === 'urgent').length;

        // Priority distribution
        const priorityDistribution = maintenance.reduce((acc, request) => {
          const priority = request.priority || 'Unknown';
          acc[priority] = (acc[priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        analytics = {
          ...analytics,
          maintenance: {
            totalRequests,
            pendingRequests,
            completedRequests,
            urgentRequests,
            completionRate: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0,
            priorityDistribution
          }
        };
      }
    }

    if (type === 'all' || type === 'inventory') {
      // Inventory analytics
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory_items')
        .select('*');

      if (!inventoryError && inventory) {
        const totalItems = inventory.length;
        const lowStockItems = inventory.filter(item => 
          item.quantity <= (item.min_stock || 5)
        ).length;
        const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
        const totalValue = inventory.reduce((sum, item) => 
          sum + ((item.quantity || 0) * (item.unit_cost || 0)), 0
        );

        // Category distribution
        const categoryDistribution = inventory.reduce((acc, item) => {
          const category = item.category || 'Unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        analytics = {
          ...analytics,
          inventory: {
            totalItems,
            lowStockItems,
            outOfStockItems,
            totalValue,
            categoryDistribution
          }
        };
      }
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