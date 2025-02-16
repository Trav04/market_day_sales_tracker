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
    body = await req.text() // Gets the raw body
    signature = req.headers.get('stripe-signature')

    if (!signature) throw new Error('Missing Stripe signature')

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // // Extract custom fields from checkout
      // const studentId = session.custom_fields?.find(
      //   (field) => field.key === 'student_id'
      // )?.text?.value;

      // const firstName = session.custom_fields?.find(
      //   (field) => field.key === 'first_name'
      // )?.text?.value;

      // const lastName = session.custom_fields?.find(
      //   (field) => field.key === 'last_name'
      // )?.text?.value;

      // // Create/update customer in Stripe
      // if (session.customer && typeof session.customer === "string") {
      //   await stripe.customers.update(session.customer, {
      //     metadata: {
      //       student_id: studentId || "N/A",
      //       salesperson_id: session.metadata?.salesperson_id || "default",
      //     },
      //     name: `${firstName} ${lastName}`,
      //     phone: session.customer_details?.phone || undefined,
      //   });
      // } else if (session.customer_email) {
      //   // Create new customer if none exists
      //   await stripe.customers.create({
      //     email: session.customer_email,
      //     name: `${firstName} ${lastName}`,
      //     phone: session.customer_details?.phone || undefined,
      //     metadata: {
      //       student_id: studentId || "N/A",
      //       salesperson_id: session.metadata?.salesperson_id || "default",
      //     },
      //   });
      // }
      
      const salespersonId = session.metadata?.salesperson_id;
    
      console.log('Received checkout.session.completed event for salesperson:', salespersonId);
      
      let id
      if (!salespersonId) {
        console.log('No salespersonId provided with metadata')
        // attribute the sale to the default
        id = process.env.DEFAULT_SALESPERSON_ID!
      } else {
        // otherwise attribute to the salesperson
        id = salespersonId
      }

      const { error, data } = await supabase.rpc('increment_sales_count', {
        salesperson_id: id,
      });
    
      if (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      } else {
        console.log('RPC call succeeded:', data);
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook failed', details: (err as Error).message },
      { status: 400 }
    )
  }
}
