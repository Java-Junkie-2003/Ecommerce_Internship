const express = require('express')
const router = express.Router()

const OrderController = require('../../controllers/order.controller')
const { authentication, authenticatorForRoleAdmin } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')


router.use(authentication)
router.post('/create', asyncHandler(OrderController.createOrder))
router.get('/self', asyncHandler(OrderController.findAllOrdersByUserId))
router.use(authenticatorForRoleAdmin)
router.get('/all-order', asyncHandler(OrderController.findAllOrdersForAdmin))
router.get('/by-user/:userId', asyncHandler(OrderController.findAllOrdersByUserForAdmin))

module.exports = router