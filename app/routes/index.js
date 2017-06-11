const express = require('express');
const router = express.Router();

// for processing async errors
const { catchErrors } = require('../handlers/errorHandlers');

// route controllers
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


// Display stores page
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));


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


module.exports = router;
