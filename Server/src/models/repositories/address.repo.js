const { NotFoundError, BadRequestError } = require('../../core/error.response')
const { convertToObjectId, getSelectData } = require('../../utils')
const addressModel = require('../address.model')


const insertMoreAddress = async ({ userId, address, addressType }) => {
    if (!userId || !address || !addressType) throw new BadRequestError("Bad request !!!")
    const doc = await addressModel.findOneAndUpdate(
        { user_id: userId },
        {
            $setOnInsert: { user_id: userId },
            $addToSet: { addresses: { address, address_type: addressType } }
        },
        { upsert: true, new: true, runValidators: true }

    ).lean()
    return doc
}
const getAllAdressByUser = async ({ userId }) => {
    const addressList = await addressModel.find({ user_id: convertToObjectId(userId) })
        .select(getSelectData(['addresses']))
    return addressList
}

const removeAddressById = async ({ userId, addressId }) => {
    const result = await addressModel.updateOne(
        { user_id: convertToObjectId(userId) },
        { $pull: { addresses: { _id: convertToObjectId(addressId) } } }
    )
    if (result.matchedCount === 0) throw new NotFoundError("User not found")
    if (result.modifiedCount === 0) throw new NotFoundError("Address not found")
    return result
}

const findAddressById = async ({userId, addressId}) => {
    const filter = userId ? {user_id: convertToObjectId(userId), 'addresses._id': convertToObjectId(addressId)}
    : {'addresses._id': addressId}
    const doc = await addressModel.findOne(filter, {'addresses.$': 1, _id: 0}).lean()
    if(!doc || !doc.addresses?.length) throw new NotFoundError('Address not found')
    return doc.addresses[0]
}

const updateAddressById = async({userId, addressId, patch}) =>{
    const updateSet = {}, options = {new: true, runValidators: true, context: 'query'}
    if(typeof patch.address === 'string'){
        updateSet['addresses.$.address'] = patch.address
    }
    if(typeof patch.addressType === 'string'){
        updateSet['addresses.$.address_type'] = patch.addressType
    }
    if(Object.keys(updateSet).length === 0){
        throw new BadRequestError('Nothing to update')
    }

    const updated = await addressModel.findOneAndUpdate(
        {user_id: convertToObjectId(userId), 'addresses._id': convertToObjectId(addressId)},
        updateSet,
        options
    ).lean()

    if(!updated) throw new NotFoundError("Not found data !!!")
    return updated
}

module.exports = {
    insertMoreAddress,
    getAllAdressByUser,
    removeAddressById,
    updateAddressById,
    findAddressById
}