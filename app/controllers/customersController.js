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
    .then((customer) => { res.send(customer) })
    .catch((e) => { res.send(e); })
})

router.post('/',(req,res) => {
    let body = req.body;

    Customer.findOne({ 'shopDomain': body.shopDomain, 'customerId': body.customerId })
    .then((customer) => {
        if(customer) {
            customer.shippingAddress.push(body.shippingAddress);
            customer.billingAddress.push(body.billingAddress);
            customer.save()
            .then((customer) => { res.send(customer); })
            .catch((e) => { res.send(e); })
        } else {
            let customer = new Customer(body);

            customer.save()
            .then((customer) => { res.send(customer); })
            .catch((e) => { res.send(e); })
        }
    })
    .catch((e) => {
        res.send(e);
    })
})

module.exports = { customersController: router }