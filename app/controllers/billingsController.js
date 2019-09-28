const express = require('express');
const axios = require('axios');
const router = express.Router();

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

router.get('/:id', (req,res) => {
    let value = req.params.id;

    Billing.findOne({ 'recurring_application_charge.id': value })
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

module.exports = { billingsController: router }