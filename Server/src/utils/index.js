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

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if(obj[k] == null) {
            delete obj[k]
        } 
    })
    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    
    Object.keys(obj).forEach(k => {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        }else{
            final[k] = obj[k]
        }
    })

    return final
}
module.exports = {
    getSelectData,
    getUnSelectData,
    getInfoData,
    genSecretKey,
    convertToObjectId,
    removeUndefinedObject,
    updateNestedObjectParser
}