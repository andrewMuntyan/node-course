const passport = require('passport');

// handle 'Log In' button click
exports.doLoginAction = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!',
});

exports.doLogoutAction = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 🖖');
  res.redirect('/');
};
