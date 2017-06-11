// db connector
const mongoose = require('mongoose');

const promisify = require('es6-promisify');

// db user model
const User = mongoose.model('User');

// Show login form page
exports.showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};


// Show register form page
exports.showRegisterForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

// middlewear for validation registration data
exports.validateRegistrationData = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply the name').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extention: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map( err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  } else {
    next();
  }
};

// middleware. handle 'Register' button click
exports.doRegisterAction = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name
  });
  // add promise to passport register method
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); // pass controll to login method
};
