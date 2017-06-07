const mongoose = require('mongoose');
const Store = mongoose.model('Store');


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

