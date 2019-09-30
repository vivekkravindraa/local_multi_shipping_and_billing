const express = require('express');
const axios = require('axios');
const router = express.Router();

const dotenv = require('dotenv').config();
const apiVersion = process.env.API_VERSION;

const { Billing } = require('../models/Billing');
const { Shopify } = require('../models/Shopify');

router.get('/', (req,res) => {
    let shop = req.query.shop;

    Billing.findOne({ shopName: shop })
    .then((billing) => {
        if(billing) {
            res.status(200).send(billing);
        } else {
            res.status(404).send('Billings data not found!');
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
});

router.get('/id', (req,res) => {
    let id = req.query.charge_id;

    Billing.findOne({ 'recurring_application_charge.id': id })
    .then((billing) => {
        if(billing) {
            console.log('BILLING RESPONSE', billing);
            res.status(200).redirect(billing.recurring_application_charge.confirmation_url);
        } else {
            res.status(404).send('Billing data not found!');
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
});

module.exports = { billingsController: router }