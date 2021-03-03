const { body } = require('express-validator');

exports.register = [
  body('email')
    .isEmail()
    .withMessage('Invalid Email')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('first_name').trim().isLength({ min: 1 }).escape(),
  body('last_name').trim().isLength({ min: 1 }).escape(),
];
