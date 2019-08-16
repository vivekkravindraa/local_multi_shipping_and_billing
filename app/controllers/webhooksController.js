const express = require('express');
const router = express.Router();

const { Customer } = require('../models/Customer');

router.post('/orders/create', (req, res) => {
  console.log('🎉 We got an order created!');

  // Get the webhook response
  let webhookResponse = req.body;
  console.log("WEBHOOK RESPONSE", webhookResponse);

  // Get the shop domain from headers
  const shopDomain = req.get('X-Shopify-Shop-Domain');

  Customer.findOne({ 'customerId': webhookResponse.customer.id })
    .then((customer) => {
      if (!customer) {
        let data = {
          'customerId': `${webhookResponse.customer.id}`,
          'shopDomain': `${shopDomain}`,
          'billingAddress': [
            {
              'orderId': `${webhookResponse.id}`,
              'address': {
                'first_name': `${webhookResponse.billing_address.first_name}`,
                'address1': `${webhookResponse.billing_address.address1}`,
                'phone': `${webhookResponse.billing_address.phone}`,
                'city': `${webhookResponse.billing_address.city}`,
                'zip': `${webhookResponse.billing_address.zip}`,
                'province': `${webhookResponse.billing_address.province}`,
                'country': `${webhookResponse.billing_address.country}`,
                'last_name': `${webhookResponse.billing_address.last_name}`,
                'address2': `${webhookResponse.billing_address.address2}`,
                'company': `${webhookResponse.billing_address.company}`,
                'latitude': `${webhookResponse.billing_address.latitude}`,
                'longitude': `${webhookResponse.billing_address.longitude}`,
                'name': `${webhookResponse.billing_address.name}`,
                'country_code': `${webhookResponse.billing_address.country_code}`,
                'province_code': `${webhookResponse.billing_address.province_code}`,
              }
            }
          ],
          'shippingAddress': [
            {
              'orderId': `${webhookResponse.id}`,
              'address': {
                'first_name': `${webhookResponse.shipping_address.first_name}`,
                'address1': `${webhookResponse.shipping_address.address1}`,
                'phone': `${webhookResponse.shipping_address.phone}`,
                'city': `${webhookResponse.shipping_address.city}`,
                'zip': `${webhookResponse.shipping_address.zip}`,
                'province': `${webhookResponse.shipping_address.province}`,
                'country': `${webhookResponse.shipping_address.country}`,
                'last_name': `${webhookResponse.shipping_address.last_name}`,
                'address2': `${webhookResponse.shipping_address.address2}`,
                'company': `${webhookResponse.shipping_address.company}`,
                'latitude': `${webhookResponse.shipping_address.latitude}`,
                'longitude': `${webhookResponse.shipping_address.longitude}`,
                'name': `${webhookResponse.shipping_address.name}`,
                'country_code': `${webhookResponse.shipping_address.country_code}`,
                'province_code': `${webhookResponse.shipping_address.province_code}`
              }
            }
          ]
        }

        let customer = new Customer(data);

        customer.save()
          .then((customer) => {
            if(csutomer) {
              res.status(200).send(customer);
            } else {
              res.status(404).send('Customer not found!');
            }
          })
          .catch((e) => {
            res.status(400).send('Unable to fetch the details..');
          })
      
      } else {
        let customerAddresses = customer.shippingAddress || customer.billingAddress;

        let result = customerAddresses.find((item) => item.orderId == webhookResponse.id);

        if(result) {
          res.status(409).send('Webhook has already pushed the data!');
        } else {
          customer.shippingAddress.push({
            'orderId': webhookResponse.id,
            'address': webhookResponse.shipping_address
          });
          customer.billingAddress.push({
            'orderId': webhookResponse.id,
            'address': webhookResponse.billing_address
          });
          customer.save()
          .then((customer) => {
            if(customer) {
              res.status(200).send(customer);
            } else {
              res.status(404).send('Customer not found!');
            }
          })
          .catch((e) => {
            res.status(400).send('Unable to fetch the details..');
          })
        }
      }
    })
    .catch((e) => {
      res.status(400).send('Unable to fetch the details..');
    })
})

module.exports = { webhooksController: router }