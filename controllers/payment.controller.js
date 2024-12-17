const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment.model"); 


// Process payment via Stripe
exports.processPayment = async (req, res) => {
  const {
    vendor_id,
    subscriptiontier,
    branchcount,
    paymentMethodId,
    customerEmail,
  } = req.body;

  try {
    const tiers = {
      starter: 1, // All lowercase
      pro: 3,
      enterprise: 5,
    };

    // Validate subscription tier
    if (!tiers[subscriptiontier?.toLowerCase()]) {
      return res.status(400).json({ error: "Invalid subscription tier." });
    }

    // Ensure branchcount is valid
    if (branchcount < 1) {
      return res
        .status(400)
        .json({ error: "Branch count must be at least 1." });
    }

    // Calculate total cost
    const baseCost = tiers[subscriptiontier?.toLowerCase()] * 100 || 0;
    if (baseCost === 0) {
      return res.status(400).json({ error: "Invalid subscription tier." });
    }

    const additionalBranchCost = branchcount > 1 ? (branchcount - 1) * 100 : 0;
    const totalCost = baseCost + additionalBranchCost;

    // Check if the customer exists in Stripe
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer if not found
      customer = await stripe.customers.create({
        email: customerEmail,
        payment_method: paymentMethodId, // Attach payment method
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Attach PaymentMethod to Customer if not already attached
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Create a PaymentIntent and confirm the payment
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost,
        currency: "gbp",
        customer: customer.id,
        payment_method: paymentMethodId,
        confirm: true, // Confirm the payment immediately
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never", // Disable redirect-based payment methods
        },
        description: `Subscription: ${subscriptiontier} (${branchcount} branches)`,
      });

      // Save payment details to your database
      await Payment.create({
        vendor_id,
        subscriptiontier: subscriptiontier.toLowerCase(), // Save in lowercase
        branchcount,
        amount: totalCost,
        paymentintentid: paymentIntent.id,
        status: paymentIntent.status,
      });

      return res.status(200).json({
        success: true,
        paymentIntent,
      });
    } catch (error) {
      console.error("Payment processing error:", error.message);
      return res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.error("Payment processing error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll(); // Fetch all payments from the database
    res.json(payments); // Send the fetched payments as JSON response
  } catch (err) {
    res.status(500).send(err.message); // Handle errors
  }
};
