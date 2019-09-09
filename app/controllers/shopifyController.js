const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();

const axios = require('axios');
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const tunnelUrl = process.env.TUNNEL_URL;
const apiVersion = process.env.API_VERSION;
const scopes = 'read_products, read_orders, write_orders';
const forwardingAddress = "http://cbshipping.kloc-apps.com";

const { Shopify } = require('../models/Shopify');

router.get('/', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

router.get('/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
        // return res.status(200).render('app', {
        //     title: 'Shopify Node App',
        //     shop: shop
        // });
    }

    if (shop && hmac && code) {
        // DONE: Validate request is from Shopify
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };

        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }

        // DONE: Exchange temporary code for a permanent access token
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                // DONE: Use access token to make API call to 'shop' endpoint
                const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/shop.json';
                const shopRequestHeaders = { 'X-Shopify-Access-Token': accessToken };

                let body = {
                    shopDomain: shop,
                    accessToken
                }
                Shopify.findOne({ shopDomain: shop }).then(user => {
                    if (!user) {
                        let userData = new Shopify(body);
                        userData
                            .save()
                            .then(userSaved => {
                                if (userSaved) {
                                    res.status(200).render('app', {
                                        title: 'Shopify Node App',
                                        shop: shop
                                    });
                                } else {
                                    res.status(404).send('Unable to create shop!');
                                }
                            })
                            .catch((e) => {
                                res.status(400).send('Unable to fetch the details..');
                            });
                    } else {
                        user.accessToken = body.accessToken;
                        user
                            .save()
                            .then(tokenUpdated => {
                                if (tokenUpdated) {
                                    // res.status(200).send('Shop found, Token updated.');
                                    res.status(200).render('app', {
                                        title: 'Shopify Node App',
                                        shop: shop
                                    });
                                } else {
                                    res.status(404).send('Shop not found!');
                                }
                            })
                            .catch((e) => {
                                res.status(400).send('Unable to fetch the details..');
                            });
                    }
                });

                axios
                    .get(`https://${shop}/admin/api/${apiVersion}/webhooks/count.json`, { headers: shopRequestHeaders })
                    .then((webhook) => {
                        if(webhook.data.count === 0) {
                            let webhookUrl = `https://${shop}/admin/api/${apiVersion}/webhooks.json`;
                            let webhookBody = {
                                "webhook": {
                                    "topic": "orders/create",
                                    "address": `${tunnelUrl}/webhooks/orders/create`,
                                    "format": "json"
                                }
                            }
                            axios
                                .post(webhookUrl, webhookBody, { headers: shopRequestHeaders })
                                .then((response) => {
                                    if(response) {
                                        res.status(200).send('Successfully registered the webhook.');
                                    } else {
                                        res.status(404).send('Webhook registration failed!');
                                    }
                                })
                                .catch((e) => {
                                    res.status(400).send('Unable to fetch the details..');
                                })
                        }
                    })
                    .catch((e) => { console.log(e); })

                request.get(shopRequestUrl, { headers: shopRequestHeaders })
                    .then((shopResponse) => {
                        if (shopResponse) {
                            // res.status(200).end(shopResponse);
                            // res.status(200).redirect(`${process.env.REACT_URL}`)
                            res.status(200).render('app', {
                                title: 'Shopify Node App',
                                shop: shop
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });

    } else {
        res.status(400).send('Required parameters missing');
    }
});

module.exports = { shopifyController: router }