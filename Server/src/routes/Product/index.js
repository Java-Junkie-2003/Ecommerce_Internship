const express = require('express')
const router = express.Router()


const ProductController = require('../../controllers/product.controller')
const {authentication, authenticatorForRoleAdmin} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')



router.get('/all', asyncHandler(ProductController.findAllProducts))
router.get('/ls-by-range', asyncHandler(productController.findProductsByPriceRange))
router.get('/category/:categoryId', asyncHandler(ProductController.findProductsByCategory))
router.get('/brand/:brandName', asyncHandler(ProductController.findProductsByBrand))
router.get('/:productId', asyncHandler(ProductController.findProduct))

router.use(authentication)
router.use(authenticatorForRoleAdmin)

router.get('/admin/all-products', asyncHandler(ProductController.findAllProductsForAdmin))
router.post('/create-product', asyncHandler(ProductController.createProduct))
router.post('/publish/:productId', asyncHandler(ProductController.publishProductForAdmin))
router.post('/unpublish/:productId', asyncHandler(ProductController.unPublishProductForAdmin))


module.exports = router