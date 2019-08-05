const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopifySchema = new Schema({
    shopDomain: { type: String },
    accessToken: { type: String },
    isWebhookRegistered: { type: Boolean, default: false }
})

const Shopify = mongoose.model('Shopify', shopifySchema);

module.exports = { Shopify }