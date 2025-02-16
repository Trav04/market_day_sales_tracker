Here’s a comprehensive `README.md` for your application. It provides an overview of the project, setup instructions, and details about the Stripe integration.

---

# Checkout Application with Stripe Integration

This application handles a checkout flow using Stripe as the payment processor. It integrates with Supabase for backend functionality and supports phone number collection, customer management, and sales attribution.

## Features

- **Stripe Checkout Integration**: Seamless payment processing with Stripe.
- **Phone Number Collection**: Requires customers to provide a phone number during checkout.
- **Customer Management**: Automatically creates or updates customer records in Stripe.
- **Sales Attribution**: Tracks salesperson performance using Supabase RPC calls.
- **Webhook Handling**: Processes Stripe webhooks for completed checkout sessions.

---

## Prerequisites

Before running the application, ensure you have the following:

1. **Stripe Account**: Create a Stripe account and obtain your API keys.
   - `STRIPE_SECRET_KEY`: Your Stripe secret key.
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret.

2. **Supabase Project**: Set up a Supabase project and obtain your credentials.
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

3. **Environment Variables**: Create a `.env` file in the root of your project with the following variables:

   ```plaintext
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DEFAULT_SALESPERSON_ID=default_salesperson_id
   ```

4. **Node.js**: Ensure Node.js (v16 or higher) is installed.

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/checkout-app.git
   cd checkout-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

4. **Set Up Stripe Webhook**:
   - In your Stripe Dashboard, create a webhook endpoint pointing to your application's `/api/webhook` route.
   - Use the `STRIPE_WEBHOOK_SECRET` to verify webhook events.

5. **Test the Checkout Flow**:
   - Start the application and navigate to the checkout page.
   - Use Stripe's test card numbers (e.g., `4242 4242 4242 4242`) to simulate payments.

---

## Application Structure

- **`/api/webhook`**: Handles Stripe webhook events.
  - Processes `checkout.session.completed` events.
  - Manages customer creation/updates in Stripe.
  - Tracks sales attribution using Supabase RPC calls.

- **Frontend**:
  - Creates a Stripe Checkout Session with phone number collection enabled.
  - Passes customer metadata (e.g., `student_id`, `salesperson_id`) to Stripe.

- **Supabase**:
  - Stores salesperson performance data.
  - Uses an RPC function (`increment_sales_count`) to update sales counts.

---

## Stripe Checkout Configuration

The checkout session is configured with the following options:

- **Phone Number Collection**: Enabled to require customers to provide a phone number.
- **Customer Management**:
  - New customers are created in Stripe with their email, name, and phone number.
  - Existing customers are updated with new information (e.g., phone number, metadata).
- **Payment Methods**: Saved payment methods are automatically displayed for returning customers.

Example Checkout Session Creation:

```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  phone_number_collection: { enabled: true },
  line_items: [/* your items */],
  mode: 'payment',
  success_url: 'https://your-app.com/success',
  cancel_url: 'https://your-app.com/cancel',
  customer: existingCustomerId, // Optional: For returning customers
  customer_update: {
    address: 'auto',
    name: 'auto',
    phone: 'auto',
  },
  metadata: {
    student_id: '12345',
    salesperson_id: '67890',
  },
});
```

---

## Webhook Handling

The webhook handler (`/api/webhook`) processes Stripe events and performs the following actions:

1. **Customer Management**:
   - Creates a new Stripe customer if one doesn't exist.
   - Updates existing customers with new metadata (e.g., `student_id`) and phone numbers.

2. **Sales Attribution**:
   - Calls a Supabase RPC function (`increment_sales_count`) to track salesperson performance.

3. **Error Handling**:
   - Logs errors and returns appropriate responses for failed webhook events.

---

## Supabase Integration

The application uses Supabase for sales attribution tracking. Ensure the following:

1. **RPC Function**:
   - Create a Supabase RPC function named `increment_sales_count` to increment sales counts for salespeople.

   Example SQL function:
   ```sql
   CREATE OR REPLACE FUNCTION increment_sales_count(salesperson_id TEXT)
   RETURNS void AS $$
   BEGIN
     UPDATE salespeople
     SET sales_count = sales_count + 1
     WHERE id = salesperson_id;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **Salespeople Table**:
   - Create a `salespeople` table to store salesperson data.

   Example table schema:
   ```sql
   CREATE TABLE salespeople (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     sales_count INT DEFAULT 0
   );
   ```

---

## Testing

1. **Stripe Test Cards**:
   - Use Stripe's test card numbers (e.g., `4242 4242 4242 4242`) to simulate payments.
   - Use the `4000 0027 6000 3184` card to trigger specific payment failures.

2. **Webhook Testing**:
   - Use the Stripe CLI to test webhooks locally:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhook
     ```
   - Trigger test events using the Stripe CLI:
     ```bash
     stripe trigger checkout.session.completed
     ```

---

## Deployment

1. **Vercel**:
   - Deploy the application to Vercel for seamless Next.js hosting.
   - Add environment variables in the Vercel dashboard.

2. **Stripe Webhook**:
   - Update your Stripe webhook endpoint to point to the deployed URL (e.g., `https://your-app.vercel.app/api/webhook`).

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---