const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');


// configuration for passport
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());