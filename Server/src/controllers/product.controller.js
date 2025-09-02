const ProductSevice = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create product successful",
            metadata: await ProductSevice.createProduct(req.body.product_type, {
                ...req.body
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Update product", 
            metadata: await ProductSevice.updateProduct(
                req.body.product_type,
                req.params.productId,
                {...req.body}
            )
        }).send(res)
    }

    findAllProducts = async (req, res, next) =>{
        new SuccessResponse({
            message: "Successfully",
            metadata: await ProductSevice.findAllProducts(req.query)
        }).send(res)
    }

    findAllProductsForAdmin = async (req, res, next) => {
        new SuccessResponse({
            message: "Successfully",
            metadata: await ProductSevice.findAllProductsForAdmin(req.query)
        }).send(res)
    }

    publishProductForAdmin = async(req, res, next) => {
        new SuccessResponse({
            message: "Successfully",
            metadata: await ProductSevice.publishProductByAdmin(req.params)
        }).send(res)
    }
    
    unPublishProductForAdmin = async(req, res, next) => {
        new SuccessResponse({
            message: "Successfully",
            metadata: await ProductSevice.unPublishProductByAdmin(req.params)
        }).send(res)
    }

    findProductsByCategory = async (req, res, next) => {
        const {categoryId} = req.params
        const {limit, page} = req.query
        new SuccessResponse({
            message: "Find product by category",
            metadata: await ProductSevice.findAllProductByCategory({
                categoryId: categoryId,
                limit,page
            })
        }).send(res)
    }

    findProductsByBrand = async(req, res, next) =>{
        const {brandName} = req.params
        const { page} = req.query

        new SuccessResponse({
            message: "Find all product by brand",
            metadata: await ProductSevice.findAllProductByBrand({
                brandName,
                page
            })
        }).send(res)
    }

    findProduct = async (req, res, next) =>{
        new SuccessResponse({
            message: "Successfully",
            metadata: await ProductSevice.findProduct({
                product_id: req.params.productId
            })
        }).send(res)
    }

    findProductsByPriceRange = async (req, res, next) => {
        const {minPrice, maxPrice, page} = req.query
        new SuccessResponse({
            message: "Successful",
            metadata: await ProductSevice.findProductsByPriceRange({
                maxPrice,
                minPrice,
                page
            })
        }).send(res)
    }

    filterProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Filter product by criteria",
            metadata: await ProductSevice.filterProduct(req.query)
        }).send(res)
    }



}


module.exports = new ProductController()
