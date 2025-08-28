
const PaymentService = require('../services/payment.service')
const {SuccessResponse} = require('../core/success.response')

class PaymentController {
    vnpayPayment = async (req, res, next) => {
        new SuccessResponse({
            message: "Payment success",
            metadata: await PaymentService.vnpayMethod({userId: req.User.userId, totalPrice: req.query.totalPrice})
        }).send(res)
    }
}

module.exports = new PaymentController()