const {model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "users"

const UserSchema = new Schema({
    user_name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    password:{
        type: String,
        trim: true
    }, 
    isActive:{
        type: Boolean,
        trim: true
    },
    roles: [
        {
            type: String,
            enum: ["USER", "ADMIN"]
        }
    ],

}, {
    timestamps: true,
    collection: COLLECTION_NAME
}) 

module.exports = model(DOCUMENT_NAME, UserSchema)