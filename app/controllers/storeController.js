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

// Stores list page
exports.getStores = async (req, res) => {
  // 1. Query database for list of stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores});
};


// Store add page
exports.showAddStoreForm = (req, res) => {
  res.render('editStore', { title: 'Add Store'});
};
exports.createStoreAction = async (req, res) => {
  // add relation Store->User. See models/Store.js
  req.body.author = req.user._id;
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created <a href="/store/${store.slug}">${store.name}</a>. Care to leave review`);
  res.redirect('/stores');
};


// upload imge middlewar
exports.upload = multer(multerOptions).single('photo');
// resize image middlewar
exports.resize = async (req, res, next) => {
  // check if there is no new fire to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
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


// Store edit page
exports.showEditStoreForm = async (req, res) => {
  // 1. Query database for store by id
  const store = await Store.findOne({ _id: req.params.id });
  // 2. owner for the store?
  confirmOwner(store, req.user);
  // 3. render edit form  
  res.render('editStore', { title: `Edit ${store.name}`, store});
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('You must own a store in order to edit it!');
  }
};

exports.updateStoreAction = async (req, res, next) => {
  // set the location data to be the point
  req.body.location.type = 'Point';
  // // 1. find and update the store
  // const store = await Store.findOneAndUpdate(
  //   { _id: req.params.id },
  //   req.body,
  //   {
  //     new: true, // return new store instead of old one
  //     runValidators: true,
  //   } 
  // ).exec();
  // 1. find and update the store
  // await Store.findById(req.params.id, async (err, store) => {
  await Store.findById('5942f3b3208b746de4a151f4', async (err, store) => {
    if (store) {
      Object.assign(store, req.body);
      const updatedStore = await store.save({ validateBeforeSave: true });
        // 2. redirect to the store and tell it worked
      req.flash('success', `Successfuly updtaed <strong>${updatedStore.name}</strong> <a href="/store/${updatedStore.slug}">View Store -></a>`);
      res.redirect(`/stores/${updatedStore._id}/edit`);
    } else {
      return next(Error('Cant find Store'));
    }
  });
  // // 2. redirect to the store and tell it worked
  // req.flash('success', `Successfuly updtaed <strong>${store.name}</strong> <a href="/stores/${store.slug}">View Store -></a>`);
  // res.redirect(`/stores/${store._id}/edit`);
};


// Single Store page. display single store page controller
exports.getStoreBySlug = async (req, res, next) => {
  // .populate is for getting author property filled with full information about author.
  // without it we just have author: _idString (see /models/Store)
  // const store = await Store.findOne({ slug: req.params.slug }).populate('author');
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) {
    return next();
  }
  res.render('store', { store, title: store.name });
};


// Tags page
exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = await Store.getTagsList();
  const storesPromise = await Store.find({ tags: tagQuery });

  const [tags, stores] = await Promise.all([
    tagsPromise,
    storesPromise
  ]);

  res.render('tag', { tags, stores, title: 'Tags', tag: tag });
};

