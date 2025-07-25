import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

// GET /api/payments - Get all payments with filtering and pagination
export async function GET(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-payments-get');
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const residentId = searchParams.get('residentId') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('payments')
      .select('*, residents(name, room_number)', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (residentId) {
      query = query.eq('resident_id', residentId);
    }

    if (startDate) {
      query = query.gte('due_date', startDate);
    }

    if (endDate) {
      query = query.lte('due_date', endDate);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: payments, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }

    // Calculate financial summary
    const totalAmount = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    const paidAmount = payments?.filter(p => p.status === 'completed').reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    const pendingAmount = payments?.filter(p => p.status === 'pending').reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
    const overdueAmount = payments?.filter(p => p.status === 'pending' && new Date(p.due_date) < new Date()).reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    // Cache the results
    const cacheKey = `payments-${page}-${limit}-${status}-${type}-${residentId}-${startDate}-${endDate}-${sortBy}-${sortOrder}`;
    performanceOptimizer.setCache(cacheKey, { payments, count, summary: { totalAmount, paidAmount, pendingAmount, overdueAmount } }, 5 * 60 * 1000);

    const totalPages = Math.ceil((count || 0) / limit);

    timer();

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount,
        overdueAmount
      },
      filters: {
        status,
        type,
        residentId,
        startDate,
        endDate,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-payments-post');
  
  try {
    const body = await request.json();
    
    // Validate required fields
    const { amount, resident_id, type, due_date } = body;
    if (!amount || !resident_id || !type || !due_date) {
      return NextResponse.json(
        { error: 'Amount, resident ID, type, and due date are required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if resident exists
    const { data: resident } = await supabase
      .from('residents')
      .select('id')
      .eq('id', resident_id)
      .single();

    if (!resident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    // Create payment
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        ...body,
        status: body.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('*, residents(name, room_number)')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      );
    }

    // Clear related caches
    performanceOptimizer.clearCache();

    timer();

    return NextResponse.json({
      message: 'Payment created successfully',
      payment
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/payments - Bulk operations
export async function PUT(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-payments-put');
  
  try {
    const body = await request.json();
    const { operation, ids, data } = body;

    if (!operation || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid bulk operation parameters' },
        { status: 400 }
      );
    }

    let result;

    switch (operation) {
      case 'markAsPaid':
        const { data: updatedPayments, error: updateError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            paid_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .in('id', ids)
          .select('*, residents(name, room_number)');

        if (updateError) {
          console.error('Database error:', updateError);
          return NextResponse.json(
            { error: 'Failed to update payments' },
            { status: 500 }
          );
        }

        result = updatedPayments;
        break;

      case 'updateStatus':
        if (!data?.status) {
          return NextResponse.json(
            { error: 'Status is required for update operation' },
            { status: 400 }
          );
        }
        
        const { data: statusUpdatedPayments, error: statusError } = await supabase
          .from('payments')
          .update({
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .in('id', ids)
          .select('*, residents(name, room_number)');

        if (statusError) {
          console.error('Database error:', statusError);
          return NextResponse.json(
            { error: 'Failed to update payment status' },
            { status: 500 }
          );
        }

        result = statusUpdatedPayments;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from('payments')
          .delete()
          .in('id', ids);

        if (deleteError) {
          console.error('Database error:', deleteError);
          return NextResponse.json(
            { error: 'Failed to delete payments' },
            { status: 500 }
          );
        }

        result = { deletedCount: ids.length };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    // Clear related caches
    performanceOptimizer.clearCache();

    timer();

    return NextResponse.json({
      message: `Bulk ${operation} completed successfully`,
      result
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 