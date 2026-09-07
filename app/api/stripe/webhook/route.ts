import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();

  // If real Stripe secrets are present, verify signature
  if (stripeSecretKey && webhookSecret && !webhookSecret.includes('sample')) {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia' as any,
    });

    const signature = req.headers.get('stripe-signature') || '';

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle events from Slide 5 (Checkout, Customer Portal, Webhooks)
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.client_reference_id;
        console.log(`✅ [Stripe Webhook] Payment succeeded for tenant: ${tenantId}`);
        // Here you would update your database (e.g. Supabase) setting tenant.plan = 'pro'
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`⚠️ [Stripe Webhook] Subscription canceled: ${subscription.id}`);
        // Update database: set tenant.plan = 'free'
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  }

  // Fallback for local testing / mock requests
  console.log('[Stripe Webhook Mock] Received ping with payload length:', body.length);
  return NextResponse.json({
    received: true,
    mode: 'simulation',
    message: 'Webhook endpoint active and ready for Stripe CLI forwarding (stripe listen --forward-to localhost:3000/api/stripe/webhook)',
  });
}
