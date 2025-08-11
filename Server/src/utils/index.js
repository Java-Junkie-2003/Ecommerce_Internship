const { Types } = require("mongoose")
const crypto = require('crypto')
const _ = require('lodash')
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
const getInfoData = ({fields=[], object = {}}) => {
    return _.pick(object, fields)
}
module.exports = {
    getSelectData,
    getUnSelectData,
    getInfoData,
    genSecretKey,
    convertToObjectId
}