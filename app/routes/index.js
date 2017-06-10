const express = require('express');
const router = express.Router();

// for processing async errors
const { catchErrors } = require('../handlers/errorHandlers');

// store routes controller
const storeController = require('../controllers/storeController');


// Display stores page
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));


// Add Store page. add store form
router.get(
  '/add',
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
router.get('/stores/:id/edit', catchErrors(storeController.showEditStoreForm));
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


module.exports = router;
