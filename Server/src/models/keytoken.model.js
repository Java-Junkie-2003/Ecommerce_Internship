
const {Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'keys';

var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    privateKey:{
        type: String,
        required: true
    },
    publicKey:{
        type: String,
        required: true
    },
    refreshTokenUsed:{
        type: Array,
        default : []
    },
    accessToken:{
        type: String,
        required: true
    },
    refreshToken:{
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema);