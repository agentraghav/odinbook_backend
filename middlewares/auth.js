const jwt = require('jsonwebtoken');

module.exports = (user_id) => {
  jwt.sign({ user_id }, process.env.SECRET, (err, token) => {
    if (err) {
      return next(err);
    }
    return token;
  });
};
