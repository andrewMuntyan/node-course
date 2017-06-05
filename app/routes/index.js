const express = require('express');
const router = express.Router();

// for processing async errors
const { catchErrors } = require('../handlers/errorHandlers');

// routes controller
const storeController = require('../controllers/storeController');

// Display stores
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// add store form
router.get('/add', storeController.addStore);
// add store form action
router.post('/add', catchErrors(storeController.createStore));

// edit store form
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
// edit store form action
router.post('/add/:id', catchErrors(storeController.updateStore));


module.exports = router;
