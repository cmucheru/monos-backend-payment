const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key
const router = express.Router();

// This is the endpoint for the webhook (you'll configure this URL in Stripe Dashboard later)
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET; // Stripe endpoint secret from the dashboard

// Webhook route to handle Stripe events
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  // Log incoming headers and body to debug
  console.log('Stripe Signature:', sig);
  console.log('Raw Body:', req.body.toString());  // Log the raw body as string

  let event;

  try {
    // Pass the raw body (Buffer) to stripe.webhooks.constructEvent
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Error verifying webhook signature:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle the event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object);
      break;

    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;

    case 'invoice.payment_succeeded':
      console.log('Invoice paid:', event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Send a success response to Stripe
  res.status(200).send('Event received');
});

module.exports = router;
