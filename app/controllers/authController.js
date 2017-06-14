const passport = require('passport');

// handle 'Log In' button click
exports.doLoginAction = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in! ✌️',
});

exports.doLogoutAction = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 🖖');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  // if user is logged in go ahead
  if (req.isAuthenticated) {
    next();
    return;
  }
  // if not - redirect to login page
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
};
