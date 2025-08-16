import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

// GET /api/residents - Get all residents with filtering and pagination
export async function GET(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-residents-get');
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const program = searchParams.get('program') || '';
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
      .from('residents')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,room_number.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (program) {
      query = query.eq('program', program);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: residents, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch residents' },
        { status: 500 }
      );
    }

    // Cache the results
    const cacheKey = `residents-${page}-${limit}-${search}-${status}-${program}-${sortBy}-${sortOrder}`;
    performanceOptimizer.setCache(cacheKey, { residents, count }, 5 * 60 * 1000); // 5 minutes

    const totalPages = Math.ceil((count || 0) / limit);

    timer();

    return NextResponse.json({
      residents,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        search,
        status,
        program,
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

// POST /api/residents - Create a new resident
export async function POST(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-residents-post');
  
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, room_number } = body;
    if (!name || !room_number) {
      return NextResponse.json(
        { error: 'Name and room number are required' },
        { status: 400 }
      );
    }

    // Check if room is already occupied
    const { data: existingResident } = await supabase
      .from('residents')
      .select('id')
      .eq('room_number', room_number)
      .eq('status', 'active')
      .single();

    if (existingResident) {
      return NextResponse.json(
        { error: 'Room is already occupied' },
        { status: 409 }
      );
    }

    // Create resident
    const { data: resident, error } = await supabase
      .from('residents')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create resident' },
        { status: 500 }
      );
    }

    // Clear related caches
    performanceOptimizer.clearCache();

    timer();

    return NextResponse.json({
      message: 'Resident created successfully',
      resident
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/residents - Update multiple residents (bulk operations)
export async function PUT(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-residents-put');
  
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
      case 'update':
        if (!data) {
          return NextResponse.json(
            { error: 'Data is required for update operation' },
            { status: 400 }
          );
        }
        
        const { data: updatedResidents, error: updateError } = await supabase
          .from('residents')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .in('id', ids)
          .select();

        if (updateError) {
          console.error('Database error:', updateError);
          return NextResponse.json(
            { error: 'Failed to update residents' },
            { status: 500 }
          );
        }

        result = updatedResidents;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from('residents')
          .delete()
          .in('id', ids);

        if (deleteError) {
          console.error('Database error:', deleteError);
          return NextResponse.json(
            { error: 'Failed to delete residents' },
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