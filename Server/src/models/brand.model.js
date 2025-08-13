const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = "Brand"
const COLLECTION_NAME = "brands"

const brandSchema = new Schema({
    brand_name: {
        type: String,
        trim: true
    },
    brand_icon: {
        type: String,
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

brandSchema.index({brand_name: 1}, {unique: true})

module.exports = model(DOCUMENT_NAME, brandSchema)