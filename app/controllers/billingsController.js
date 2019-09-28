const express = require('express');
const axios = require('axios');
const router = express.Router();

const { Billing } =  require('../models/Billing');

router.get('/', (req,res) => {
    Billing.find()
    .then((response) => {
        if(response) {
            res.status(200).send(response);
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

    Billing.findOne({ id: billingId })
    .then((response) => {
        if(response) {
            res.status(200).send(response);
        } else {
            res.status(404).send('Billing data not found!');
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
});

module.exports = { billingsController: router }