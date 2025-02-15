import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', 
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  let body: string
  let signature: string | null

  try {
    body = await req.text() // Now gets raw body
    signature = req.headers.get('stripe-signature')

    if (!signature) throw new Error('Missing Stripe signature')

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const salespersonId = session.metadata?.salesperson_id // Add optional chaining

      if (!salespersonId) throw new Error('Missing salesperson_id in metadata')

      // Update sales count
      await supabase
        .from('sales')
        .update({ sales_count: salespeople.sales_count + 1 })
        .eq('id', salespersonId)
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook failed', details: err.message },
      { status: 400 }
    )
  }
}