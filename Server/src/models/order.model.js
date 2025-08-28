const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = "Order"
const COLLECTION_NAME = "orders"

const orderSchema = new Schema({
    order_userId: {type: Types.ObjectId, ref: 'User', required: true},
    order_checkout: {type: Object, default: {}},
    order_shipping: {type: Object, default: {}},
    order_payment: {type: String, enum: ['COD', 'VNPAY'], default: "COD"},
    order_products: {type: Array, required: true},
    order_status: {type: String, enum: ['PENDING', 'DELIVERING', 'DELIVERIED', 'CANCELED'], default: 'PENDING'},
    payment_status: {type: String, enum: ['PENDING', 'PAID'], default: 'PENDING'},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})



module.exports = model(DOCUMENT_NAME, orderSchema)