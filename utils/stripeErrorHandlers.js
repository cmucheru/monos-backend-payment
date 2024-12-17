const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Import Stripe

module.exports.handleStripeError = async (paymentMethod, amount, description, customer) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      customer: customer.id,
      payment_method: paymentMethod,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
      },
      description: description,
    });
    return { success: true, paymentIntent };
  } catch (error) {
    // Log the error for detailed inspection
    console.error('Stripe Error:', error);

    // Differentiate between card errors and other errors
    if (error.type === 'StripeCardError') {
      switch (error.code) {
        case 'card_declined':
          throw new Error('Payment declined: Card error. Please check your card details.');
        case 'insufficient_funds':
          throw new Error('Payment declined: Insufficient funds.');
        case 'expired_card':
          throw new Error('Payment declined: Card has expired.');
        case 'incorrect_cvc':
          throw new Error('Payment declined: Incorrect CVC.');
        case 'incorrect_number':
          throw new Error('Payment declined: Incorrect card number.');
        case 'card_velocity_exceeded':
          throw new Error('Payment declined: Exceeded velocity limit.');
        default:
          throw new Error('Payment failed due to an unknown card error.');
      }
    } else {
      throw new Error('Payment processing error.');
    }
  }
};
