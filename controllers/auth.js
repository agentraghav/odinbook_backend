const passport = require('passport');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const generateJWT = require('../middlewares/auth');

const User = require('../models/users');

const { validationResult } = require('express-validator');

exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return res.status(400).json(err);
    if (!user) {
      return res.redirect(process.env.FRONTPAGE);
    }
    jwt.sign({ user_id: user._id }, process.env, SECRET, (err, token) => {
      res.cookie('token', token);
      res.json({ user, token });
    });
  });
};
