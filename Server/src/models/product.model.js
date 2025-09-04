const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = "Product"
const COLLECTION_NAME = "products"

const productSchema = new Schema({
    product_name: {
        type: String,
        trim: true,
        required: true
    },
    product_thumb: {
        type: String,
        trim: true
    },
    product_description: {
        type: String,
        trim: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Perfume']
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be less 5.0"],
        set: val => Math.round(val * 10) / 10
    },
    product_categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }
    ],
    product_brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


productSchema.index({ product_type: 1 })
productSchema.index({ product_brand: 1 })
productSchema.index({ product_name: 'text', product_description: 'text' },
{ default_language: 'none', weights: { product_name: 10, product_description: 2 } })

const perfumeSchema = new Schema({
    fragrance_family: {
        type: String,
        trim: true
    },
    top_note: {
        type: String,
        trim: true
    },
    base_note: {
        type: String,
        trim: true
    },
    concentration: {
        type: String,
        trim: true
    },
    volume: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    longevity_hours: {
        type: String,
        trim: true
    },
    sillage: {
        type: String,
        trim: true
    },
    launch_year: {
        type: Number,
    }
}, {
    collection: 'perfumes',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    perfume: model("Perfume", perfumeSchema)
}