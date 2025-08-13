

const { product, perfume } = require('../models/product.model')
const { BadRequestError, NotFoundError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findAllProducts, findProduct, findAllDraftsForShop, 
findAllProductByCategory, findAllProductByBrand, 
publishProductByAdmin, findAllProductsForAdmin, unPublishProductByAdmin } = require('../models/repositories/product.repo')
class ProductFactory {

    static productRegistry = {} // key-class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!type) throw new BadRequestError(`Invalid type: ${type}`)
        return new productClass(payload).createProduct()
    }



    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_thumb', 'product_price']
        })
    }
    static async findAllProductsForAdmin({ limit = 50, sort = 'ctime', page = 1, filter = {} }){
         return await findAllProductsForAdmin({
            limit, sort, page, filter,
            select: ['product_name', 'product_thumb', 'product_price']
        })
    }

    static async publishProductByAdmin({productId}){
        return await publishProductByAdmin({product_id: productId})
    }

    static async unPublishProductByAdmin({productId}){
        return await unPublishProductByAdmin({product_id: productId})
    }

    static async findAllProductByCategory({ categoryId, limit = 50, sort = 'ctime', page = 1 }) {
        const filter = {
            product_type: "Perfume",
            product_categories: categoryId,
            isPublished: true
        }
        return await findAllProductByCategory({
            limit, sort, page, filter,
            select: ['product_name', 'product_thumb', 'product_price']
        })
    }
    static async findAllProductByBrand({brandName, limit = 50, sort='-ctime', page = 1}){
        return await findAllProductByBrand({brand_name: brandName, limit, sort, page, 
            select: ['product_name', 'product_thumb', 'product_price']})
    }
    static async findProduct({ product_id, unSelect }) {
        return await findProduct({ product_id, unSelect })
    }
    static async findAllDraftForAdmin({ limit = 50, skip = 0 }) {
        const query = { isDraft: true }
        return findAllDraftsForShop({ query, limit, skip })
    }
}

// define base product class
class Product {
    constructor({ product_name, product_thumb, product_description, product_price,
        product_type, product_attributes, product_ratingAverage, product_categories, product_brand }) {
        this.product_name = product_name,
            this.product_thumb = product_thumb,
            this.product_description = product_description,
            this.product_price = product_price,
            this.product_type = product_type,
            this.product_attributes = product_attributes,
            this.product_ratingAverage = product_ratingAverage,
            this.product_categories = product_categories,
            this.product_brand = product_brand
    }
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

// define sub-class for different product

class Perfume extends Product {
    async createProduct() {
        const newPerfume = await perfume.create(this.product_attributes)
        if (!newPerfume) throw new BadRequestError("Invalid request !!")
        const newProduct = await super.createProduct(newPerfume._id)
        if (!newProduct) throw new BadRequestError("Invalid request !!!")

        return newProduct
    }
}

ProductFactory.registerProductType('Perfume', Perfume)

module.exports = ProductFactory