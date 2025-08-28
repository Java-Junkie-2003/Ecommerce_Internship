const {insertMoreAddress, getAllAdressByUser, removeAddressById, updateAddressById} = require('../models/repositories/address.repo')


class AddressService{

    static async insertAddress({userId, address, addressType}) {
        return await insertMoreAddress({userId, address, addressType})
    }

    static async getAllAddress(userId) {
        return await getAllAdressByUser({userId})
    }
    static async removeAddressById({userId, addressId}){
        return await removeAddressById({userId, addressId})
    }
    static async updateAddress({userId, addressId, bodyUpdate}){
        return await updateAddressById({userId, addressId, patch: bodyUpdate})
    }
}

module.exports = AddressService