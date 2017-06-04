const express = require('express');
const router = express.Router();

// routes controllers
const storeController = require('../controllers/storeController');

// Do work here
router.get('/', storeController.homePage);

module.exports = router;
