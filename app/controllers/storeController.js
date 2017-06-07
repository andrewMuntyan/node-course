// db connector
const mongoose = require('mongoose');
// db model
const Store = mongoose.model('Store');
// uploader
const multer = require('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' });
    }
  }
};
// resize images
const jimp = require('jimp');
const uuid = require('uuid');

exports.getStores = async (req, res) => {
  // 1. Query database for list of stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores});
};


exports.showAddStoreForm = (req, res) => {
  res.render('editStore', { title: 'Add Store'});
};
exports.createStoreAction = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave review`);
  res.redirect('/stores');
};

// upload middlewar
exports.upload = multer(multerOptions).single('photo');

// resize middlewar
exports.resize = async (req, res, next) => {
  // check if there is no new fire to resize
  if (!req.file) {
    next(); // skip to the next middleware
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // do resizing
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // after we have written photo to filesystem
  next();
};


exports.showEditStoreForm = async (req, res) => {
  // 1. Query database for store by id
  const store = await Store.findOne({ _id: req.params.id });
  // 2. owner for the store?
  // 3. render edit form  
  res.render('editStore', { title: `Edit ${store.name}`, store});
};
exports.updateStoreAction = async (req, res) => {
  // set the location data to be the point
  req.body.location.type = 'Point';
  // 1. find and update the store
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true, // return new store instead of old one
      runValidators: true,
    } 
  ).exec();
  // 2. redirect to the store and tell it worked
  req.flash('success', `Successfuly updtaed <strong>${store.name}</strong> <a href="/stores/${store.slug}">View Store -></a>`);
  res.redirect(`/stores/${store._id}/edit`);
};


// display single store page controller
exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) {
    return next();
  }
  res.render('store', { store, title: store.name });
};

