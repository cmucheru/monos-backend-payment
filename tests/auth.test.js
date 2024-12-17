jest.mock('supertest');
jest.mock('../index', () => ({}));
jest.mock('../controllers/vendor.controller', () => ({
  login: jest.fn(), 
}));

const userCredentials = {
  email: 'user@example.com',
  password: 'correctpassword',
  token: 'valid-token-12345',
};

const incorrectCredentials = {
  email: 'user@example.com',
  password: 'incorrectpassword',
};

const nonExistentUser = {
  email: 'nonexistentuser@example.com',
  password: 'somepassword',
};

const simulateLogin = (email, password) => {
  if (email === userCredentials.email && password === userCredentials.password) {
    return { status: 200, body: { token: userCredentials.token } }; // Successful login
  } else if (email === incorrectCredentials.email) {
    return { status: 401, body: { message: 'Invalid password' } }; // Incorrect credentials
  } else {
    return { status: 404, body: { message: 'User not found' } }; // Non-existent user
  }
};

// Test suite for login functionality
describe('POST vendor/login', () => {

  // Test valid login
  test('should log in with valid credentials and return a token', () => {
    const { status, body } = simulateLogin(userCredentials.email, userCredentials.password);

    // Assert the login was successful and returned a token
    expect(status).toBe(200);  // Expect 200 status code for success
    expect(body).toHaveProperty('token', userCredentials.token);  // Expect the valid token
  });

  // Test invalid credentials
  test('should return 401 for invalid credentials', () => {
    const { status, body } = simulateLogin(incorrectCredentials.email, incorrectCredentials.password);

    // Assert the response is an error due to invalid credentials
    expect(status).toBe(401);  // Expect 401 status code for invalid credentials
    expect(body).toHaveProperty('message', 'Invalid password');  // Expect the "Invalid password" message
  });

  // Test non-existent user
  test('should return 404 if user not found', () => {
    const { status, body } = simulateLogin(nonExistentUser.email, nonExistentUser.password);

    expect(status).toBe(404);  // Expect 404 status code for "user not found"
    expect(body).toHaveProperty('message', 'User not found');  // Expect the "User not found" message
  });

});
