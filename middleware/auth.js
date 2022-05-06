const jwt = require('jsonwebtoken');
const config = require('config');

// a middleware function always takes in req, req and next
module.exports = function(req, res, next) {
  // get the token from the header
  const token = req.header('x-auth-token');

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied!' });
  }

  // verify token | decoded.user = { id: 'xyz' }
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;

    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ msg: 'Token you entered is invalid!' });
  }
};
