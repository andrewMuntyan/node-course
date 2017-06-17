// db connector
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose should use native promises
mongoose.Promise = global.Promise;

// middlewear for slugs
const slug = require('slugs');

// Store model
const storeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates'
      }
    ],
    address: {
      type: String,
      required: 'You must supply an address'
    },
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
});

// preSave hook for additional operations before save action
storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    // if we do not need to do anything with slug
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // find dupliction of slugs and make a slag unique
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

// Static method for Store model
storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags'},
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

// Define indexes for this model
storeSchema.index({
  name: 'text',
  description: 'text',
})

module.exports = mongoose.model('Store', storeSchema);