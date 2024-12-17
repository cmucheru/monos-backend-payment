const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

module.exports = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');  // Extract token from Authorization header

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
    req.vendor = decoded;  // Attach decoded vendor info to the request
    next();  // Pass control to the next middleware/handler
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
};
