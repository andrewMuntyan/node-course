const express = require('express');
const router = express.Router();

// for processing async errors
const { catchErrors } = require('../handlers/errorHandlers');

// store routes controller
const storeController = require('../controllers/storeController');


// Display stores
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));


// add store form
router.get('/add', storeController.showAddStoreForm);
// add store form action
router.post('/add', catchErrors(storeController.createStoreAction));


// edit store form
router.get('/stores/:id/edit', catchErrors(storeController.showEditStoreForm));
// edit store form action
router.post('/add/:id', catchErrors(storeController.updateStoreAction));


module.exports = router;
