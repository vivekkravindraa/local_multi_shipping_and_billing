const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customerId: { type: String },
    shopDomain: { type: String },
    shippingAddress: [{
        first_name: { type: String },
        address1: { type: String },
        phone: { type: String },
        city: { type: String },
        zip: { type: String },
        province: { type: String },
        country: { type: String },
        last_name: { type: String },
        address2: { type: String },
        company: { type: String },
        latitude: { type: String },
        longitude: { type: String },
        name: { type: String },
        country_code: { type: String },
        province_code: { type: String }
    }],
    billingAddress: [{
        first_name: { type: String },
        address1: { type: String },
        phone: { type: String },
        city: { type: String },
        zip: { type: String },
        province: { type: String },
        country: { type: String },
        last_name: { type: String },
        address2: { type: String },
        company: { type: String },
        latitude: { type: String },
        longitude: { type: String },
        name: { type: String },
        country_code: { type: String },
        province_code: { type: String },
    }]
})

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer }

// "first_name": "Bob",
// "last_name": "Biller",
// "name": "Bob Biller",
// "address1": "123 Billing Street",
// "address2": null,
// "city": "Billtown",
// "country": "United States",
// "country_code": "US",
// "province": "Kentucky",
// "province_code": "KY"
// "zip": "K2P0B0",
// "phone": "555-555-BILL",
// "company": "My Company",
// "latitude": null,
// "longitude": null