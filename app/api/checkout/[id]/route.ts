import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params before destructuring
  const { id } = await params

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Add custom fields for student data collection
      custom_fields: [
        {
          key: 'student_id',
          label: { type: 'custom', custom: 'Student ID' },
          type: 'text',
          optional: false, // make it mandatory
        },
        {
          key: 'full_name',
          label: { type: 'custom', custom: 'Full Name' },
          type: 'text',
          optional: false, // make it mandatory
        },
      ],
      metadata: {
        salesperson_id: id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership-payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });
    
    return NextResponse.redirect(session.url!)
  } catch (err) {
    return NextResponse.json(
      { error: `Checkout failed: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
