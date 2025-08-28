const express = require('express')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

const AddressController = require('../../controllers/address.controller')
const asyncHandler = require('../../helpers/asyncHandler')

router.use(authentication)
router.get('/', asyncHandler(AddressController.getAllAddressByUser))
router.post('/add', asyncHandler(AddressController.insertAddress))
router.delete('/rm/:addressId', asyncHandler(AddressController.removeAddress))
router.put('/update/:addressId', asyncHandler(AddressController.updateAddress))
module.exports = router