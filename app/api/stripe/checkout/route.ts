import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { plan, tenantId, returnUrl } = await req.json();

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // 1. If real Stripe key is configured in .env.local
    if (stripeSecretKey && !stripeSecretKey.includes('sample')) {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2024-11-20.acacia' as any,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        client_reference_id: tenantId,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `${plan.toUpperCase()} Plan - Baltic Cloud SaaS`,
                description: `Multi-tenant subscription for tenant: ${tenantId}`,
              },
              unit_amount: plan === 'pro' ? 2900 : 9900, // 29€ or 99€
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${returnUrl || 'http://localhost:3000'}/?payment=success&plan=${plan}`,
        cancel_url: `${returnUrl || 'http://localhost:3000'}/?payment=cancelled`,
      });

      return NextResponse.json({ url: session.url, mode: 'real' });
    }

    // 2. Demo simulation mode (when students don't have Stripe keys yet during lab)
    return NextResponse.json({
      url: `/?payment=success&plan=${plan}&demo=true`,
      mode: 'mock',
      message: 'Stripe Mock Checkout: Simulated successful payment for student testing.',
    });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
