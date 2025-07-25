import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

// GET /api/residents/[id] - Get a specific resident
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const timer = performanceOptimizer.startTimer('api-resident-get');
  
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid resident ID' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `resident-${id}`;
    const cached = performanceOptimizer.getCache(cacheKey);
    if (cached) {
      timer();
      return NextResponse.json(cached);
    }

    // Fetch from database
    const { data: resident, error } = await supabase
      .from('residents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Resident not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resident' },
        { status: 500 }
      );
    }

    // Cache the result
    performanceOptimizer.setCache(cacheKey, resident, 10 * 60 * 1000); // 10 minutes

    timer();

    return NextResponse.json(resident);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/residents/[id] - Update a specific resident
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const timer = performanceOptimizer.startTimer('api-resident-put');
  
  try {
    const { id } = params;
    const body = await request.json();

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid resident ID' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { name, room_number } = body;
    if (!name || !room_number) {
      return NextResponse.json(
        { error: 'Name and room number are required' },
        { status: 400 }
      );
    }

    // Check if resident exists
    const { data: existingResident } = await supabase
      .from('residents')
      .select('id, room_number')
      .eq('id', id)
      .single();

    if (!existingResident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    // Check if new room is already occupied (if room number changed)
    if (existingResident.room_number !== room_number) {
      const { data: roomOccupied } = await supabase
        .from('residents')
        .select('id')
        .eq('room_number', room_number)
        .eq('status', 'active')
        .neq('id', id)
        .single();

      if (roomOccupied) {
        return NextResponse.json(
          { error: 'Room is already occupied' },
          { status: 409 }
        );
      }
    }

    // Update resident
    const { data: resident, error } = await supabase
      .from('residents')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update resident' },
        { status: 500 }
      );
    }

    // Clear related caches
    performanceOptimizer.clearCache();

    timer();

    return NextResponse.json({
      message: 'Resident updated successfully',
      resident
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/residents/[id] - Delete a specific resident
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const timer = performanceOptimizer.startTimer('api-resident-delete');
  
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid resident ID' },
        { status: 400 }
      );
    }

    // Check if resident exists
    const { data: existingResident } = await supabase
      .from('residents')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingResident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    // Delete resident
    const { error } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete resident' },
        { status: 500 }
      );
    }

    // Clear related caches
    performanceOptimizer.clearCache();

    timer();

    return NextResponse.json({
      message: 'Resident deleted successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/residents/[id] - Partial update of a resident
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const timer = performanceOptimizer.startTimer('api-resident-patch');
  
  try {
    const { id } = params;
    const body = await request.json();

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid resident ID' },
        { status: 400 }
      );
    }

    // Check if resident exists
    const { data: existingResident } = await supabase
      .from('residents')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingResident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    // Partial update
    const { data: resident, error } = await supabase
      .from('residents')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update resident' },
        { status: 500 }
      );
    }

    // Clear related caches
    performanceOptimizer.clearCache();

    timer();

    return NextResponse.json({
      message: 'Resident updated successfully',
      resident
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 