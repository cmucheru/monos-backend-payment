const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Vendor = require('../models/vendor.model');
const db = require('../config/db.config');  // Import your database configuration

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Attempting to find vendor by email: ${email}`);
    const vendor = await db.query('SELECT * FROM vendors WHERE email = $1', {
      bind: [email],
      type: db.QueryTypes.SELECT,
    });

    if (vendor.length === 0) {
      console.log('Vendor not found');
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Vendor not found' });
    }

    if (vendor[0].password !== password) {
      console.log('Password mismatch');
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: vendor[0].id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error', error });
  }
};

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.status(200).json(vendors);
  } catch (err) {
    console.error("Error fetching vendors:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch vendors", error: err.message });
  }
};

// Create a vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, email, subscription_tier, branch_count } = req.body;
    const vendor = await Vendor.create({
      name,
      email,
      subscription_tier,
      branch_count,
    });
    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
