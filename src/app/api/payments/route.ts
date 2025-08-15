import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { performanceOptimizer } from '@/utils/performanceOptimizer';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// GET /api/payments - Get payments with filtering and pagination
export async function GET(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-payments-get');
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const residentId = searchParams.get('residentId');
    const status = searchParams.get('status');
    const paymentType = searchParams.get('paymentType');
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
      .select(`
        *,
        residents (
          id,
          first_name,
          last_name,
          email
        )
      `, { count: 'exact' });

    // Apply filters
    if (residentId) {
      query = query.eq('resident_id', residentId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (paymentType) {
      query = query.eq('payment_type', paymentType);
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

    // Cache the results
    const cacheKey = `payments-${page}-${limit}-${residentId}-${status}-${paymentType}-${sortBy}-${sortOrder}`;
    performanceOptimizer.setCache(cacheKey, { payments, count }, 5 * 60 * 1000); // 5 minutes

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
      filters: {
        residentId,
        status,
        paymentType,
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
    const { residentId, amount, paymentType, paymentMethod, dueDate } = body;
    if (!residentId || !amount || !paymentType || !paymentMethod || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
      .select('id, first_name, last_name, email')
      .eq('id', residentId)
      .single();

    if (!resident) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }

    let paymentIntent = null;
    let stripePaymentId = null;

    // If payment method is card, create Stripe payment intent
    if (paymentMethod === 'card') {
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            residentId,
            paymentType,
            residentName: `${resident.first_name} ${resident.last_name}`
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });
        
        stripePaymentId = paymentIntent.id;
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return NextResponse.json(
          { error: 'Payment processing failed' },
          { status: 500 }
        );
      }
    }

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        resident_id: residentId,
        amount,
        payment_type: paymentType,
        payment_method: paymentMethod,
        status: paymentMethod === 'card' ? 'pending' : 'completed',
        due_date: dueDate,
        paid_date: paymentMethod !== 'card' ? new Date().toISOString() : null,
        notes: body.notes,
        stripe_payment_id: stripePaymentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        residents (
          id,
          first_name,
          last_name,
          email
        )
      `)
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
      payment,
      clientSecret: paymentIntent?.client_secret
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/payments - Update payment status
export async function PUT(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-payments-put');
  
  try {
    const body = await request.json();
    const { paymentId, status, notes } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Payment ID and status are required' },
        { status: 400 }
      );
    }

    // Update payment
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updateData.paid_date = new Date().toISOString();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .select(`
        *,
        residents (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      );
    }

    // Clear related caches
    performanceOptimizer.clearCache();

    timer();

    return NextResponse.json({
      message: 'Payment updated successfully',
      payment
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 