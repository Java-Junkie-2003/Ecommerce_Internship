
const { NotFoundError } = require('../core/error.response')
const cart = require('../models/cart.model')
const { createUserCart, updateCartQuantity, deleteCart, getListCart, checkProductExist } = require('../models/repositories/cart.repo')
const { findProduct } = require('../models/repositories/product.repo')

class CartService {
    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ cart_userId: userId })
        const foundProduct = await findProduct({product_id: product.productId, unSelect: ['__v']})
        if(!foundProduct) throw new NotFoundError('Not found product')
        product['product_name'] = foundProduct.product_name
        product['product_thumb'] = foundProduct.product_thumb
        product['product_price'] = foundProduct.product_price
        if (!userCart) {
            return await createUserCart({ userId, product })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        if(!userCart.cart_products.some(item => item.productId === product.productId)){
            userCart.cart_products = [ ...userCart.cart_products, product]
            return await userCart.save()
        }

        return await updateCartQuantity({ userId, product })
    }

    static async updateCart({ userId, product = {} }) {
        const { productId, quantity, old_quantity } = product
        const foundPorduct = await findProduct({ product_id: productId, unSelect: ['__v'] })
        if (!foundPorduct) throw new NotFoundError('Not found product')
        if (quantity === 0) {
            return await deleteCart({ userId, productId })
        }
        return await updateCartQuantity({ userId, product: { ...product, quantity: quantity - old_quantity  } })
    }

    static async deleteProductInCart({userId, productId}){
        return await deleteCart({userId, productId})
    }

    static async getListCart({ userId }) {
        return await getListCart({ userId })
    }

}

module.exports = CartService