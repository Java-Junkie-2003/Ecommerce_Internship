const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = "Address"
const COLLECTION_NAME = "addresses"

const addressSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    addresses: [
        {
            address: {type: String, required: true},
            address_type: {type: String, enum: ["HOME", "COMPANY"]}
        }
    ]

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

addressSchema.index({user_id: 1}, {unique: true})

module.exports = model(DOCUMENT_NAME, addressSchema)