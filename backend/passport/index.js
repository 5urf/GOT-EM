const passport = require('passport');

const local = require('./strategies/local');
const jwt = require('./strategies/jwt');

module.exports = () => {
  passport.use(local);
  passport.use(jwt);
};