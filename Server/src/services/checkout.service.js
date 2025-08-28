const { BadRequestError } = require("../core/error.response")
const { findCartById, deleteCart } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { acquireLock, releaseLock } = require("./redis.service")
const orderModel = require('../models/order.model')
const { findAddressById } = require("../models/repositories/address.repo")
class CheckoutService {


    /*
        req.body:
    {
        item_products: [
            {   price,
                quantity,
                productId
            }
        ]
    }
    
    */
    static async checkoutReview({ userId, item_products }) {
        const foundCart = await findCartById({ userId })
        if (!foundCart) throw new BadRequestError('Cart does not exists')
        const checkout_order = {
            totalPrice: 0,
            feeShip: 30000,
            totalCheckout: 0
        }

        const checkProductServer = await checkProductByServer(item_products)
        if (!checkProductServer[0]) throw new BadRequestError('Order wrong !!!')

        const checkoutPrice = checkProductServer.reduce((acc, product) => {
            return acc + (product.quantity * product.price)
        }, 0)

        checkout_order.totalPrice += checkoutPrice
        checkout_order.totalCheckout += (checkoutPrice + checkout_order.feeShip)
        return {
            item_products: checkProductServer,
            checkout_order
        }
    }

    static async orderByUser({ item_products, userId, addressId, payment_method }) {
        console.log("addressId:", addressId)
        const { item_products: item_products_new, checkout_order } = await CheckoutService.checkoutReview({ userId, item_products })
        const accquireProduct = []
        for (let i = 0; i < item_products_new.length; i++) {
            const { productId, quantity } = item_products_new[i]
            const {key, token} = await acquireLock(productId, quantity, userId)
            accquireProduct.push(key ? true : false)
            if (key) {
                await releaseLock(key, token)
            }
        }
        if (accquireProduct.includes(false)) {
            throw new BadRequestError("A product is not enough stock !!!")
        }
        const address = await findAddressById({ userId, addressId })
        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: address,
            order_payment: payment_method,
            order_products: item_products_new,
            payment_status: payment_method === 'COD' ? 'PENDING' : 'PAID'
        })
        if (newOrder) {
            for (let i = 0; i < item_products_new.length; i++) {
                const {productId} = item_products_new[i]
                await deleteCart({ userId, productId })
            }
        }
        return newOrder
    }

}


module.exports = CheckoutService