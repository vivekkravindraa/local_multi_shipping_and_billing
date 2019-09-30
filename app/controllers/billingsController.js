const express = require('express');
const axios = require('axios');
const router = express.Router();

const dotenv = require('dotenv').config();
const apiVersion = process.env.API_VERSION;

const { Billing } =  require('../models/Billing');

router.get('/', (req,res) => {
    Billing.find()
    .then((billings) => {
        if(billings) {
            res.status(200).send(billings);
        } else {
            res.status(404).send('Billings data not found!');
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
});

router.get('/:billingId', (req,res) => {
    let id = req.params.billingId;

    Billing.findOne({ 'recurring_application_charge.id': id })
    .then((billing) => {
        if(billing) {
            res.status(200).send(billing);
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