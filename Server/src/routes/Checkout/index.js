const express = require('express')
const router = express.Router()

const CheckoutController = require('../../controllers/checkout.controller')
const {authentication} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')


router.use(authentication)
router.post('/', asyncHandler(CheckoutController.checkoutReview))

module.exports = router