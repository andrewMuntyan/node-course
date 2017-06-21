// db connector
const mongoose = require('mongoose');

// db model
const Review = mongoose.model('Review');



// Do add revirew action
exports.doAddReviewAction = async (req, res) => {
  req.body.author = req.user._id;
  req.body.store = req.params.storeId;
  const newReview = new Review(req.body);
  await newReview.save();

  req.flash('success', 'Review Saved');
  res.redirect('back');
};