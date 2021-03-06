// db connector
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose should use native promises
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
// shows errors in nice way
const mongodbErrorHandler = require('mongoose-mongodb-errors');
// plugin for managing login process
const passportLocalMongoose = require('passport-local-mongoose');


// User model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address'],
    require: 'Please supply an email address'
  },
  name: {
    type: String,
    trim: true,
    required: 'Please supply a name',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  hearts:[
    {type: mongoose.Schema.ObjectId, ref: 'Store'}
  ]
});

// add register, authenticate, logout methods to User model
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

// virtual fields for User model. Calcolated on the fly
userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

module.exports = mongoose.model('User', userSchema);