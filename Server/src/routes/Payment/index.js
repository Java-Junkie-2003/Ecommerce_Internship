
const express = require('express')
const router = express.Router()

const {authentication} = require('../../auth/authUtils')
const PaymentController = require('../../controllers/payment.controller')
const asyncHandler = require('../../helpers/asyncHandler')


router.use(authentication)
router.post('', asyncHandler(PaymentController.vnpayPayment))

module.exports = router