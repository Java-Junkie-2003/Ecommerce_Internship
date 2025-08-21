const { SuccessResponse } = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Add product to cart",
            metadata: await CartService.addToCart({
                userId: req.User.userId,
                product: req.body
            })
        }).send(res)
    }

    updateCart = async(req, res, next) => {
        new SuccessResponse({
            message: "Update cart quantity",
            metadata: await CartService.updateCart({
                userId: req.User.userId,
                product: req.body
            })
        }).send(res)
    }

    deleteProductInCart = async(req, res, next) => {
         new SuccessResponse({
            message: "Delete product in cart",
            metadata: await CartService.deleteProductInCart({
                userId: req.User.userId,
                productId: req.params.productId
            })
        }).send(res)
    }

    getListProductInCart = async(req, res, next) => {
        new SuccessResponse({
            message: "List product in cart",
            metadata: await CartService.getListCart({
                userId: req.User.userId,
            })
        }).send(res)
    }
}


module.exports = new CartController()