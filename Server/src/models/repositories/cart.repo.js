const { convertToObjectId } = require('../../utils')
const cart = require('../cart.model')

const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
}

const checkProductExist = async({userId, productId}) => {
    const query = {cart_userId: userId, 'cart_products.productId': productId}
    return await cart.exists(query);
} 

const updateCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = { cart_userId: userId, 'cart_products.productId': productId },
        updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }
    return await cart.findOneAndUpdate(query, updateSet, options)
}

const deleteCart = async ({ userId, productId })=>{
    const query = { cart_userId: userId },
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
}

const getListCart = async ({ userId })=>{
    return await cart.findOne({
        cart_userId: userId
    }).lean()
}

const findCartById = async ({userId}) => {
    return await cart.findOne({cart_userId: convertToObjectId(userId)})
}
module.exports = {
    createUserCart,
    updateCartQuantity,
    deleteCart,
    getListCart,
    checkProductExist,
    findCartById
}