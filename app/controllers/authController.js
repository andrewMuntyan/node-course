const passport = require('passport');

// handle 'Log In' button click
exports.doAuthAction = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!',
});