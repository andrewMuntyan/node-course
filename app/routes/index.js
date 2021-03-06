const express = require('express');
const router = express.Router();

// for processing async errors
const { catchErrors } = require('../handlers/errorHandlers');

// route controllers
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');


// Display stores page
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));


// Add Store page. add store form
router.get(
  '/add',
  authController.isLoggedIn,
  storeController.showAddStoreForm
);
// add store form action
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStoreAction)
);


// Edit Store page. edit store form
router.get(
  '/stores/:id/edit',
  authController.isLoggedIn,
  catchErrors(storeController.showEditStoreForm)
);
// edit store form action
router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStoreAction)
);


// Single Store page. display single store page
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));


// Tags page
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));


// Show map page
router.get('/map', storeController.mapPage);


// Login page
router.get('/login', userController.showLoginForm);
router.post('/login', authController.doLoginAction);
router.get('/logout', authController.doLogoutAction);


// Register page
router.get('/register', userController.showRegisterForm);
// 1. validate the registration data
// 2. register the user
// 3. log them in
router.post(
  '/register',
  userController.validateRegistrationData,
  userController.doRegisterAction,
  authController.doLoginAction
);


// User account page
router.get(
  '/account',
  authController.isLoggedIn,
  userController.showAccountPage
);

// User account update action
router.post('/account', catchErrors(userController.doEditAccountAction));


// Reset password flow
// 1. email reset link
router.post('/account/forgot', catchErrors(authController.generateAndEmailToken));
// 2. process url with secret token
// 2.1 show reset password form
router.get('/account/reset/:token', catchErrors(authController.showResetPasswordForm));
// 2.1 do reset password action
router.post(
  '/account/reset/:token', 
  authController.confirmedPasswords,
  catchErrors(authController.updatePassword)
);


// Show 'likes' page
router.get(
  '/hearts',
  authController.isLoggedIn,
  catchErrors(storeController.getHearts)
);


// Do post revirew
router.post(
  '/reviews/:storeId',
  authController.isLoggedIn,
  catchErrors(reviewController.doAddReviewAction)
);

// Show top stores page
router.get('/top', catchErrors(storeController.getTopStores));


/*
  API endpoints
*/

// store searching
router.get('/api/search', catchErrors(storeController.searchStores));

// gets stores by location
router.get(
  '/api/stores/near',
  catchErrors(storeController.mapStores)
);

// like the store 
router.post(
  '/api/stores/:id/heart',
  catchErrors(storeController.heartStore)
);

module.exports = router;
