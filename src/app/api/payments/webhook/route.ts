import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        paid_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: `Payment confirmed via Stripe. Transaction ID: ${paymentIntent.id}`
      })
      .eq('stripe_payment_id', paymentIntent.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update payment status:', error);
      return;
    }

    console.log(`Payment ${paymentIntent.id} marked as completed for resident ${payment.resident_id}`);

    // Send confirmation email to resident
    // await sendPaymentConfirmationEmail(payment);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
        notes: `Payment failed via Stripe. Transaction ID: ${paymentIntent.id}. Last error: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
      })
      .eq('stripe_payment_id', paymentIntent.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update payment status:', error);
      return;
    }

    console.log(`Payment ${paymentIntent.id} marked as failed for resident ${payment.resident_id}`);

    // Send failure notification to resident
    // await sendPaymentFailureEmail(payment);

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
        notes: `Payment canceled via Stripe. Transaction ID: ${paymentIntent.id}`
      })
      .eq('stripe_payment_id', paymentIntent.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update payment status:', error);
      return;
    }

    console.log(`Payment ${paymentIntent.id} marked as canceled for resident ${payment.resident_id}`);

  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}
