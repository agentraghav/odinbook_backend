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

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  const { email, first_name, last_name, password } = req.body;
  User.findOne({ email: email })
    .populate('friends')
    .exec((err, user) => {
      if (err) {
        return res.status(400).json(err);
      }
      if (user) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(400).json(err);
        }
        const newUser = new User({
          email: email,
          first_name: first_name,
          last_name: last_name,
          password: hash,
        });
        const saveUser = await newUser.save()
        jwt.sign({user_id: saveUser._id}, process.env.JWT_SECRET, (err, token) => {
          if(err) return res.status(400).json(err);
          res.json(token);
        })
      });
    });
};
