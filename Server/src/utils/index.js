const { Types } = require("mongoose")
const crypto = require('crypto')

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((e) => [e, 1]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((e) => [e, 0]))
}

const convertToObjectId = (id) => {
    return new Types.ObjectId(id);
}
const genSecretKey = _ =>{
    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');
    return {
        publicKey,
        privateKey
    }
}

module.exports = {
    getSelectData,
    getUnSelectData,
    genSecretKey,
    convertToObjectId
}