import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { NextRequest } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', 
})

// Define an explicit type for the context parameter, treating `params` as a Promise
type Context = {
  params: Promise<{ id: string }>; // Wrap `params` in a Promise
};

export async function GET(
  req: NextRequest,
  context: Context // Explicitly use the Context type here
) {
  try {
    const { id } = await context.params; // Await the promise to get the `id`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        salesperson_id: id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    if (!session.url) {
      throw new Error('Stripe session URL is missing');
    }

    return NextResponse.redirect(session.url);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
