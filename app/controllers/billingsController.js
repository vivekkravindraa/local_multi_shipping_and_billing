const express = require('express');
const axios = require('axios');
const router = express.Router();

const dotenv = require('dotenv').config();
const apiVersion = process.env.API_VERSION;
const appName = process.env.APP_NAME;

const { Billing } = require('../models/Billing');
const { Shopify } = require('../models/Shopify');

router.get('/', (req,res) => {
    let id = req.query.charge_id;

    let dateNow = new Date();
    let date = JSON.stringify(dateNow).slice(1,11);
    console.log(date);

    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    console.log(JSON.stringify(tomorrow).slice(1,11));

    Billing.findOne({ 'recurring_application_charge.id': id })
    .then((billing) => {
        if(billing) {
            let chargeId = billing.recurring_application_charge.id;
            let billingBody = {
                'recurring_application_charge': {
                    'id': Number(`${billing.recurring_application_charge.id}`),
                    'name': `${billing.recurring_application_charge.name}`,
                    'api_client_id': Number(`${billing.recurring_application_charge.api_client_id}`),
                    'price': `${billing.recurring_application_charge.price}`,
                    'status': `${billing.recurring_application_charge.status}` == 'pending' ? 'accepted' : `${billing.recurring_application_charge.status}`,
                    'return_url': `${billing.recurring_application_charge.return_url}`,
                    'billing_on': `${billing.recurring_application_charge.billing_on}` == 'null' ? `${date}` : `${billing.recurring_application_charge.billing_on}`,
                    'created_at': `${billing.recurring_application_charge.created_at}`,
                    'updated_at': `${billing.recurring_application_charge.updated_at}`,
                    'test': Boolean(`${billing.recurring_application_charge.test}`),
                    'activated_on': `${billing.recurring_application_charge.activated_on}` == 'null' ? null : `${billing.recurring_application_charge.activated_on}`,
                    'cancelled_on': `${billing.recurring_application_charge.cancelled_on}` == 'null' ? null : `${billing.recurring_application_charge.cancelled_on}`,
                    'trial_days': Number(`${billing.recurring_application_charge.trial_days}`),
                    'trail_ends_on': `${billing.recurring_application_charge.trail_ends_on}` == 'null' ? `${tomorrow}` : `${billing.recurring_application_charge.trail_ends_on}`,
                    'decorated_return_url': `${billing.recurring_application_charge.decorated_return_url}`
                }
            };

            Shopify.findOne({ shopDomain: billing.shopName })
            .then((response) => {
                let shop = response.shopDomain;
                let token = response.accessToken;
                
                axios
                    .post(`https://${shop}/admin/api/${apiVersion}/recurring_application_charges/${chargeId}/activate.json`,
                        billingBody,
                        { headers: { 'X-Shopify-Access-Token' : token }
                    })
                    .then((response) => {
                        if(response) {
                            let id = response.data.recurring_application_charge.id;
                            let status = response.data.recurring_application_charge.status;
                            let billing_on = response.data.recurring_application_charge.billing_on;

                            Billing.findOne({ 'recurring_application_charge.id': id})
                            .then((response) => {
                                response.recurring_application_charge.status = status;
                                response.recurring_application_charge.billing_on = billing_on;
                                return response.save();
                            })
                            .then((response) => {
                                res.redirect(`https://${shop}/admin/apps/${process.env.APP_NAME}`);
                            })
                            .catch((e) => {
                                console.log(e);
                            })
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            })
            .catch((e) => {
                console.log(e);
            })
        } else {
            res.status(404).send('Billing data not found!');
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
});

router.get('/domain', (req,res) => {
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

module.exports = { billingsController: router }