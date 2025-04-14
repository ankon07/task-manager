// backend/utils/validation.util.js
// Placeholder for input validation functions [cite: 17]
// Consider using libraries like 'express-validator' or 'joi' for robust validation

// Example using express-validator (requires installation: npm install express-validator)
/*
const { body, validationResult } = require('express-validator');

exports.validateSignup = [
  body('username').trim().notEmpty().withMessage('Username is required.')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
  body('email').isEmail().withMessage('Invalid email address.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateTask = [
   body('title').trim().notEmpty().withMessage('Task title is required.'),
   body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority value.'),
   body('dueDate').optional().isISO8601().toDate().withMessage('Invalid due date format.'),
   (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Collect error messages
      const errorMessages = errors.array().map(err => err.msg);
      return res.status(400).json({ message: "Validation failed.", errors: errorMessages });
    }
    next();
  },
]
// Add more validation chains as needed...
*/

// Simple placeholder validation functions
const isValidEmail = (email) => {
    // Basic email regex (consider a more robust one or library for production)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

module.exports = {
    isValidEmail
    // Add other simple validation functions if not using a library
};