//RUN:  node automated_testing.js
const stripe = require('stripe')('sk_test_51QWd3rP8IfexbQCPcBX0fQGCDOHHkzGfTt3Qmx1CgVJCqlvFVfKJbLdk2vShoZPymr54YDRVSisjvo9ub0nLZECK00stmt8UAT');

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
