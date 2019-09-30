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
            // res.status(200).send(billing);
            console.log('BILLING RESPONSE', billing);
            let billingBody = {
                'recurring_application_charge': {
                    'id': `${billing.recurring_application_charge.id}`,
                    'name': `${billing.recurring_application_charge.name}`,
                    'api_client_id': `${billing.recurring_application_charge.api_client_id}`,
                    'price': `${billing.recurring_application_charge.price}`,
                    'status': `${billing.recurring_application_charge.status}` == 'pending' ? 'accepted' : `${billing.recurring_application_charge.status}`,
                    'return_url': `${billing.recurring_application_charge.return_url}`,
                    'billing_on': `${billing.recurring_application_charge.created_at.slice(0,10)}`,
                    'created_at': `${billing.recurring_application_charge.created_at}`,
                    'updated_at': `${billing.recurring_application_charge.updated_at}`,
                    'test': `${billing.recurring_application_charge.test}`,
                    'activated_on': `${billing.recurring_application_charge.activated_on}`,
                    'cancelled_on': `${billing.recurring_application_charge.cancelled_on}`,
                    'trial_days': `${billing.recurring_application_charge.trial_days}`,
                    'trail_ends_on': `${billing.recurring_application_charge.trail_ends_on}`,
                    'decorated_return_url': `${billing.recurring_application_charge.decorated_return_url}`
                }
            };
            let shop = billing.shopName;
            let chargeId = billing.recurring_application_charge.id;
            Shopify.findOne({ shopDomain: shop }).then((shopResponse) => {
                if(shopResponse) {
                    console.log('SHOP RESPONSE', shopResponse);
                    let shopDomain = shopResponse.shopDomain;
                    let accessToken = shopResponse.accessToken;
                    axios
                        .post(`https://${shopDomain}/admin/api/${apiVersion}/recurring_application_charges/${chargeId}/activate.json`, billingBody, {
                            'X-Shopify-Access-Token': accessToken
                        })
                        .then((response) => {
                            console.log(response.data);
                        })
                        .catch((e) => {
                            console.log(e);
                        })
                }
            })
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