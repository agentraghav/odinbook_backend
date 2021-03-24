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

exports.posts = [
  body('content')
    .not()
    .isEmpty()
    .withMessage('Must provide some content')
    .trim(),
  body('user').not().isEmpty().withMessage('Must provide an author ID').trim(),
  body('timestamp').not().isEmpty().withMessage('Missing timestamp'),
];

exports.comments = [
  body('content')
    .not()
    .isEmpty()
    .withMessage('Must provide some content.')
    .trim(),
  body('user').not().isEmpty().withMessage('Must provide an author ID.').trim(),
];
