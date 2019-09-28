const express = require('express');
const axios = require('axios');
const router = express.Router();

const { Billing } =  require('../models/Billing');

router.get('/', (req,res) => { });
router.post('/', (req,res) => { });

module.exports = { billingsController: router }