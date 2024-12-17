const { body, validationResult } = require('express-validator');

// Middleware to validate requests with specific error messages
const validate = (validations) => async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Create a readable error message for the client
        const errorMessages = errors.array().map(
            (err) => `Field '${err.param}' error: ${err.msg}`
        );
        return res.status(400).json({ 
            message: 'Validation failed',
            details: errorMessages
        });
    }
    next();
};

// Example validation rules for vendor creation
const validateVendor = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),
    body('subscription_tier')
        .optional()
        .isIn(['basic', 'premium', 'enterprise'])
        .withMessage('Invalid subscription tier (allowed values: basic, premium, enterprise)'),
    body('branch_count')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Branch count must be a positive integer'),
];


module.exports = {
    validate,
    validateVendor,
};
