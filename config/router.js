const express = require('express');

const { homeController } = require('../app/controllers/homeController');
const { customersController } = require('../app/controllers/customersController');
const { shopifyController } = require('../app/controllers/shopifyController');
const { webhooksController } = require('../app/controllers/webhooksController');

const router = express.Router();

router.use('/', homeController);
router.use('/customers', customersController);
router.use('/shopify', shopifyController);
router.use('/webhooks', webhooksController);

module.exports = { router }