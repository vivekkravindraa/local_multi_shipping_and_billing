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
            res.status(200).send(billing);
            // console.log('BILLING RESPONSE',billing);
            // let chargeId = billing.recurring_application_charge.id;
            // Shopify.findOne({ shopDomain: billing.shopName })
            // .then((response) => {
            //     if(response) {
            //         console.log('SHOP RESPONSE',response);
            //         let shop = response.shopDomain;
            //         let token = response.accessToken;
            //         axios.get(`https://${shop}/admin/api/${apiVersion}/recurring_application_charges/${chargeId}.json`, {
            //             'X-Shopify-Access-Token': token
            //         })
            //         .then((response) => { console.log('API RESPONSE',response.data) })
            //         .catch((e) => { console.log(e) })
            //     }
            // })
            // .catch((e) => {
            //     console.log(e);
            // })
        } else {
            res.status(404).send('Billing data not found!');
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
});

router.get('/activate', (req,res) => {
    console.log(req.query.params);

    let shop = req.query.shop;
    let chargeId = req.query.chargeId;

    axios.post(`https://${shop}/admin/api/${apiVersion}/recurring_application_charges/${chargeId}/activate.json`, {}, {})
    .then((response) => {
        console.log(response.data);
    })
    .catch((e) => {
        console.log(e);
    })
});

module.exports = { billingsController: router }