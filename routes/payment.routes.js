const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller'); // Import payment controller
const authenticateVendor = require('../middlewares/auth.middleware'); // Import auth middleware

// Route to get all payments
router.get('/all-payments', paymentController.getAllPayments);  // Correctly use the controller method

// Route to process a payment via Stripe
router.post('/process-payment', authenticateVendor, paymentController.processPayment);  // Apply auth middleware

module.exports = router;
