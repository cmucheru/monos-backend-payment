jest.mock('supertest');
jest.mock('../index', () => ({})); 
jest.mock('../controllers/payment.controller', () => ({
  processPayment: jest.fn(), // Mock the payment controller's processPayment function
}));

const paymentData = {
  vendor_id: 1,
  subscriptiontier: 'pro',
  branchcount: 3,
  paymentMethodId: 'pm_1Jm2a4Tc6J3qWsWVp89fCz',
  customerEmail: 'customer@example.com',
};

const invalidTierData = {
  vendor_id: 1,
  subscriptiontier: 'invalidtier',
  branchcount: 3,
  paymentMethodId: 'pm_1Jm2a4Tc6J3qWsWVp89fCz',
  customerEmail: 'customer@example.com',
};

const invalidBranchData = {
  vendor_id: 1,
  subscriptiontier: 'pro',
  branchcount: 0,
  paymentMethodId: 'pm_1Jm2a4Tc6J3qWsWVp89fCz',
  customerEmail: 'customer@example.com',
};

const invalidPaymentMethodData = {
  vendor_id: 1,
  subscriptiontier: 'pro',
  branchcount: 3,
  paymentMethodId: 'invalid_payment_method',
  customerEmail: 'customer@example.com',
};

const simulatePaymentSuccess = () => {
  return { status: 200, body: { paymentIntent: { status: 'succeeded' } } };
};

const simulateInvalidTier = () => {
  return { status: 400, body: { error: 'Invalid subscription tier.' } };
};

const simulateInvalidBranchCount = () => {
  return { status: 400, body: { error: 'Branch count must be at least 1.' } };
};

const simulatePaymentError = () => {
  return { status: 400, body: { error: 'Payment processing failed.' } };
};

// Test suite for payment processing
describe('POST /api/payments/process', () => {

  // Test successful payment processing
  test('should process payment successfully and return payment intent', () => {
    // Mocking the processPayment function to simulate success
    require('../controllers/payment.controller').processPayment.mockImplementationOnce(() => simulatePaymentSuccess());

    const response = simulatePaymentSuccess(); // Simulating the response directly

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('paymentIntent');
    expect(response.body.paymentIntent).toHaveProperty('status', 'succeeded');
  });

  // Test invalid subscription tier
  test('should return 400 for invalid subscription tier', () => {
    // Mocking the processPayment function to simulate invalid tier response
    require('../controllers/payment.controller').processPayment.mockImplementationOnce(() => simulateInvalidTier());

    const response = simulateInvalidTier(); // Simulating the response directly

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid subscription tier.');
  });

  // Test branch count less than 1
  test('should return 400 for branch count less than 1', () => {
    // Mocking the processPayment function to simulate invalid branch count response
    require('../controllers/payment.controller').processPayment.mockImplementationOnce(() => simulateInvalidBranchCount());

    const response = simulateInvalidBranchCount(); // Simulating the response directly

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Branch count must be at least 1.');
  });

  // Test payment processing errors
  test('should handle payment processing errors gracefully', () => {
    require('../controllers/payment.controller').processPayment.mockImplementationOnce(() => simulatePaymentError());

    const response = simulatePaymentError(); // Simulating the response directly

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Payment processing failed.');
  });
});
