const passport = require('passport');
const bcrypt = require('bcrypt');
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/users');

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    (user, done) => {
      if (!user) return done(null, error);
      return done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['displayName', 'email', 'photos'],
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
        if (user) {
          return cb(err, user);
        } else {
          User.create(
            {
              email: profile.emails[0].value,
              profile_photo: profile.photos[0].value,
              facebookID: profile.id,
              display_name: profile.displayName,
            },
            (err, user) => {
              return cb(err, user);
            }
          );
        }
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ email: email }).exec((err, user) => {
        if (err) return done(err);
        if (!user) {
          return done({ message: 'Email not found' }, false);
        }
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            return done(err);
          }
          if (!match) {
            return done({ message: 'Password is invalid' }, false);
          }
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  return cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

module.exports = passport;
