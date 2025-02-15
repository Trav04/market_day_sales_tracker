import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export function generateStripeLink(salespersonId: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/payment/${salespersonId}`
}

export async function createCheckoutSession(salespersonId: string) {
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.PRICE_ID,
      quantity: 1,
    }],
    mode: 'payment',
    metadata: { salesperson_id: salespersonId },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
  })
}