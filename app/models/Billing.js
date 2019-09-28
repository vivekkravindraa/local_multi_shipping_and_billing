const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingSchema = new Schema({
    recurring_application_charge: {
        id: { type: String },
        name: { type: String },
        api_client_id: { type: Number },
        price: { type: String },
        status: { type: String },
        return_url: { type: String },
        billing_on: { type: String },
        created_at: { type: String },
        updated_at: { type: String },
        test: { type: Boolean },
        activated_on: { type: String },
        cancelled_on: { type: String },
        trial_days: { type: Number },
        trial_ends_on: { type: String },
        decorated_return_url: { type: String },
        confirmation_url: { type: String }
    }
})

const Billing = mongoose.model('Billing', billingSchema);

module.exports = { Billing }

// {
//     "recurring_application_charge": {
//         "id": 10635575401,
//         "name": "Plan@4.99",
//         "api_client_id": 3163459,
//         "price": "4.99",
//         "status": "pending",
//         "return_url": "http://plan.shopifyapps.com/",
//         "billing_on": null,
//         "created_at": "2019-09-27T07:54:13-04:00",
//         "updated_at": "2019-09-27T07:54:13-04:00",
//         "test": true,
//         "activated_on": null,
//         "cancelled_on": null,
//         "trial_days": 0,
//         "trial_ends_on": null,
//         "decorated_return_url": "http://plan.shopifyapps.com/?charge_id=10635575401",
//         "confirmation_url": "https://klocgold3.myshopify.com/admin/charges/10635575401/confirm_recurring_application_charge?signature=BAh7BzoHaWRsKwhpAO55AgA6EmF1dG9fYWN0aXZhdGVG--3b10992dbc7fb6c8ddfe4669fece12ea2a78bbd2"
//     }
// }
