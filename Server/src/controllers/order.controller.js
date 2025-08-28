const OrderService = require('../services/order.service')
const CheckoutService = require('../services/checkout.service')
const { SuccessResponse } = require('../core/success.response')

class OrderController {

    createOrder = async(req, res, next) => {
        new SuccessResponse({
            message: "Create order",
            metadata: await CheckoutService.orderByUser({
                item_products: req.body.item_products,
                userId: req.User.userId,
                addressId: req.body.addressId,
                payment_method: req.body.payment_method
            })
        }).send(res)
    }

    findAllOrdersByUserId = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all order by user id",
            metadata: await OrderService.findAllOrderByUserId({ userId: req.User.userId, page: req.query.page })
        }).send(res)
    }

    findAllOrdersByUserForAdmin = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all order by user for admin',
            metadata: await OrderService.findAllOrderByUserId({userId: req.params.userId, page: req.query.page})
        }).send(res)
    }

    findAllOrdersForAdmin = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all order by user id",
            metadata: await OrderService.findAllOrdersForAdmin({ page: req.query.page })
        }).send(res)
    }
}

module.exports = new OrderController()