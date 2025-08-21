const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()



router.use(authentication)
router.get('/', asyncHandler(cartController.getListProductInCart))
router.post("/add-to-cart", asyncHandler(cartController.addToCart))
router.put("/update-cart", asyncHandler(cartController.updateCart))
router.delete('/delete/:productId', asyncHandler(cartController.deleteProductInCart))

module.exports = router