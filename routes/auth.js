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

router.get('/logout', authController.logout);

router.get(
  '/isLoggedIn',
  passport.authenticate('jwt', { session: false }),
  authController.isLoggedIn
);

router.get(
  '/getToken',
  passport.authenticate('jwt', { session: false }),
  authController.getUserToken
);

module.exports = router;
