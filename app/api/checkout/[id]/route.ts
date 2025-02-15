import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', 
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.PRICE_ID,
        quantity: 1,
      }],
      mode: 'payment',
      metadata: {
        salesperson_id: params.id
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    })

    return NextResponse.redirect(session.url!)
  } catch (err) {
    return NextResponse.json(
      { error: `Checkout failed: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
