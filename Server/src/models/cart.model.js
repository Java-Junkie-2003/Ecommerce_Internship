const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "carts"

const cartSchema = new Schema({
   
    cart_products: {
        type: Array,
        required: true,
        default: []
    },

    cart_count_products: {
        type: Number,
        default: 0
    },
    cart_userId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})



module.exports = model(DOCUMENT_NAME, cartSchema)