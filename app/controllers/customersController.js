const express = require('express');
const router = express.Router();

const { Customer } = require('../models/Customer');

router.get('/',(req,res) => {
    Customer.find()
    .then((customers) => { res.send(customers); })
    .catch((e) => { res.send(e); })
})

router.get('/:customerId', (req,res) => {
    let customerId = req.params.customerId;

    Customer.findOne({ customerId })
    .then((customer) => {
        if(customer) {
            res.status(200).send(customer)
        } else {
            res.status(404).send('No Address Found!');
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
})

router.post('/',(req,res) => {
    let body = req.body;

    Customer.findOne({ 'shopDomain': body.shopDomain, 'customerId': body.customerId })
    .then((customer) => {
        if(customer) {
            customer.shippingAddress.push(body.shippingAddress);
            customer.billingAddress.push(body.billingAddress);
            customer.save()
            .then((customer) => {
                if(customer) {
                    res.status(200).send(customer);
                } else {
                    res.status(404).send('Not Found');
                }
            })
            .catch((e) => {
                res.status(400).send('Unable to fetch the details..');
            })
        } else {
            let customer = new Customer(body);

            customer.save()
            .then((customer) => {
                if(customer) {
                    res.status(200).send(customer); 
                } else {
                    res.status(404).send('Not Found');
                }
            })
            .catch((e) => {
                res.status(400).send('Unable to fetch the details..');
            })
        }
    })
    .catch((e) => {
        res.status(400).send('Unable to fetch the details..');
    })
})

module.exports = { customersController: router }