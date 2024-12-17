//RUN:  node automated_testing.js
const stripe = require('stripe')('your-stripe-secret-key');

async function createPaymentIntent() {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // Amount in cents
      currency: 'gbp',
      payment_method: 'pm_card_visa', // Example payment method
      automatic_payment_methods: {
        enabled: true, // Enable automatic payment methods
        allow_redirects: 'never', // Prevent redirects from payment methods
      },
    });

    console.log('PaymentIntent created:', paymentIntent);
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
  }
}

createPaymentIntent();
