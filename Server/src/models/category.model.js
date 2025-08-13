const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = "Category"
const COLLECTION_NAME = "categories"

const categorySchema = new Schema({
    category_name: {
        type: String,
        trim: true
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, categorySchema)