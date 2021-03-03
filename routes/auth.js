const router = require('express').Router();

const passport = require('passport');

const authController = require('../controllers/auth');

router.post('/login', authController.login);

router.post('/register', authController.register);

// facebook auth

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { session: false })
);

router.get('/auth/facebook/callback', authController.facebook_callback);

module.exports = router;
