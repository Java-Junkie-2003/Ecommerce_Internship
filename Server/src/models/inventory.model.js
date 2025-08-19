const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = "Inventory"
const COLLECTION_NAME = "inventories"

const inventorySchema = new Schema({
    inven_product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    inven_location: {
        type: String,
        default: 'Unknown'
    },
    inven_stock: {
        type: Number,
        require: true
    },
    inven_reservations: {
        type: Array,
        default: []
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


module.exports = model(DOCUMENT_NAME, inventorySchema)