
const CheckoutService = require('../services/checkout.service')

const {SuccessResponse} = require('../core/success.response')

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: "Checkout list",
            metadata: await CheckoutService.checkoutReview({userId: req.User.userId, item_products: req.body.item_products})
        }).send(res)
    }
}


module.exports = new CheckoutController()