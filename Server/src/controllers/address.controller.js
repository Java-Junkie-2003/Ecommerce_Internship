const AddressService = require('../services/address.service')
const { SuccessResponse } = require('../core/success.response')
class AddressController {
    insertAddress = async (req, res, next) => {
        new SuccessResponse({
            message: "Insert more address",
            metadata: await AddressService.insertAddress({ userId: req.User.userId, ...req.body })
        }).send(res)
    }

    getAllAddressByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all address",
            metadata: await AddressService.getAllAddress(req.User.userId)
        }).send(res)
    }
    removeAddress = async (req, res, next) => {
        new SuccessResponse({
            message: "Removed address",
            metadata: await AddressService.removeAddressById({ userId: req.User.userId, addressId: req.params.addressId })
        }).send(res)
    }
    updateAddress = async (req, res, next) => {
        new SuccessResponse({
            message: "Updated address",
            metadata: await AddressService.updateAddress(
                {
                    userId: req.User.userId,
                    addressId: req.params.addressId,
                    bodyUpdate: req.body
                }
            )
        }).send(res)
    }
}


module.exports = new AddressController()