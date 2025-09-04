const { product } = require('../product.model')
const { Types } = require('mongoose')
require('../brand.model')
require('../category.model')
const { getSelectData, getUnSelectData, convertToObjectId } = require('../../utils')
const { findInvenByProductId } = require('./inventory.repo')
const { NotFoundError, BadRequestError } = require('../../core/error.response')
const brandModel = require('../brand.model')
const { sortBy } = require('lodash')
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const findProduct = async ({ product_id, unSelect = [] }) => {
    return await product.findById(product_id)
        .populate("product_brand", "brand_name brand_icon _id")
        .populate("product_categories", "category_name _id")
        .select(getUnSelectData(unSelect))
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate("product_brand", "brand_name brand_icon -_id")
        .populate("product_categories", "category_name -_id")
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProductByCategory = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

const findAllProductByBrand = async ({ brand_name, limit, sort, page, select }) => {
    const limitNum = Math.max(1, Number(limit) || 50);
    const pageNum = Math.max(1, Number(page) || 1);
    const skip = (pageNum - 1) * limitNum;
    const sortBy =
        sort === 'ctime' ? { createdAt: 1 } :
            sort === '-ctime' ? { createdAt: -1 } :
                { createdAt: -1 };

    const products = await product.aggregate([
        { $match: { product_type: 'Perfume', isPublished: true } },
        {
            $lookup: {
                from: 'brands',
                localField: 'product_brand',
                foreignField: '_id',
                as: 'brand_info'
            }
        },
        { $unwind: '$brand_info' },
        { $match: { 'brand_info.brand_name': brand_name } },
        { $sort: sortBy },
        { $skip: skip },
        { $limit: limitNum },
        { $project: getSelectData(select) }
    ]).
        allowDiskUse(true)
        .option({ maxTimeMS: 5000 })
        .exec()
    return products
}

const publishProductByAdmin = async ({ product_id }) => {
    if (!Types.ObjectId.isValid(product_id)) return null;

    const doc = await product.findById(product_id);
    if (!doc) return null;

    if (doc.isPublished && !doc.isDraft) return 0;

    doc.set({ isPublished: true, isDraft: false });
    await doc.save();
    return 1;
};

const unPublishProductByAdmin = async ({ product_id }) => {
    if (!Types.ObjectId.isValid(product_id)) return null;

    const doc = await product.findById(product_id);
    if (!doc) return null;

    doc.set({ isPublished: false, isDraft: true });
    await doc.save();
    return 1;
};
const findAllProductsForAdmin = async ({ limit, sort, page, filter = {}, select = [] }) => {
    const safeLimit = Math.max(1, Number(limit) || 50);
    const safePage = Math.max(1, Number(page) || 1);
    const skip = (safePage - 1) * safeLimit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const [products, total] = await Promise.all([
        product.find(filter)
            .populate('product_categories', 'category_name _id')
            .populate('product_brand', 'brand_name brand_icon -_id')
            .sort(sortBy)
            .skip(skip)
            .limit(safeLimit)
            .select(getSelectData(select))
            .lean(),
        product.countDocuments(filter)
    ])

    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const hasNext = safePage < totalPages
    const hasPrev = safePage > 1


    return {
        products,
        pagination: {
            totalProduct: total,
            count: product.length,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNext,
            hasPrev,
            nextPage: hasNext ? safePage + 1 : null,
            prevPage: hasPrev ? safePage - 1 : null
        }
    }
}

const findProductsByPriceRange = async ({ minPrice, maxPrice, limit, page, sort, select = [] }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find({ product_price: { $gte: minPrice, $lte: maxPrice } })
        .populate("product_brand", "brand_name brand_icon -_id")
        .populate("product_categories", "category_name -_id")
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await findProduct({ product_id: product.productId, unSelect: ['__v'] })
        if (foundProduct) {
            const foundInventory = await findInvenByProductId({ productId: foundProduct._id })
            if (!foundInventory) throw new NotFoundError('Not found !!!')
            if (product.quantity > foundInventory.inven_stock) throw new BadRequestError('Not enough quantity in stock')
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: foundProduct._id
            }
        }
    }))
}

const filterProduct = async ({
    key_search,
    brand_name,
    categoryId,
    categoryIds,
    minPrice,
    maxPrice,
    isPublished = true,
    page = 1,
    limit = 20,
    sort = '-ctime',
    productType = 'Perfume',
    select = []
}) => {
    const limitNum = Math.max(1, Number(limit) || 20);
    const pageNum = Math.max(1, Number(page) || 1);
    const skip = (pageNum - 1) * limitNum;

    const filter = {}

    if (typeof isPublished === 'boolean') filter.isPublished = isPublished
    if (productType) filter.product_type = productType

    if (minPrice != null || maxPrice != null) {
        filter.product_price = {}
        if (minPrice != null) filter.product_price.$gte = Number(minPrice)
        if (maxPrice != null) filter.product_price.$lte = Number(maxPrice)
    }

    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length) {
        filter.product_categories = { $in: categoryIds.map(convertToObjectId) }
    }
    else if (categoryId) {
        filter.product_categories = convertToObjectId(categoryId)
    }

    if (brand_name) {
        const brand = await brandModel.findOne({ brand_name }).select('_id').lean()
        if (!brand) {
            return {
                results: [],
                pagination: {
                    totalResult: 0,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: pageNum > 1
                }
            }
        }
        filter.product_brand = brand._id
    }

    const useTextSearch = typeof key_search === 'string' && key_search.trim().length > 0;
    if (useTextSearch) {
        filter.$text = { $search: key_search.trim() };
    }

    const sortMap = {
        ctime: { createdAt: 1 },
        '-ctime': { createdAt: -1 },
        price: { product_price: 1 },
        '-price': { product_price: -1 },
        name: { product_name: 1 },
        '-name': { product_name: -1 },
    }

    const userSort = (sortMap[sort] || sortMap['-ctime'])
    const sortBy = useTextSearch
        ? { score: { $meta: 'textScore' }, ...userSort }
        : userSort

    const baseSelect = getSelectData(select)
    const projection = {
        ...baseSelect,
        ...(useTextSearch ? { score: { $meta: 'textScore' } } : {})
    }

    const [results, total] = await Promise.all([
        product.find(filter, projection)
            .populate('product_brand', 'brand_name brand_icon -_id')
            .populate('product_categories', 'category_name -_id')
            .sort(sortBy)
            .skip(skip)
            .limit(limitNum)
            .lean()
            .exec(),
        product.countDocuments(filter)
    ])

    const totalPages = Math.max(1, Math.ceil(total / limitNum))
    const hasNext = pageNum < totalPages
    const hasPrev = pageNum > 1

    return {
        products: results,
        pagination: {
            totalResult: total,
            page: pageNum,
            limit: limitNum,
            totalPages,
            hasNext,
            hasPrev
        }
    }
}

const textSearch = async ({ key_search }) => {
    const regexSearch = new RegExp(key_search)
    const results = product.find({
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .select(getSelectData(['_id', 'product_name', 'product_thumb', 'product_price']))
        .lean()
    return results
}

const findProductsByBrandId = async ({ brandId, limit, sort }) => {
    const sortBy = sort === 'ctime' ? { createdAt: 1 } : { createdAt: -1 }
    const limitNum = Math.max(1, Number(limit) || 4);
    return await product.find({ product_brand: convertToObjectId(brandId) })
        .populate('product_brand', 'brand_name bran_icon -_id')
        .populate('product_categories', 'category_name -_id')
        .limit(limitNum)
        .sort(sortBy)
        .select(getUnSelectData(['product_attributes']))
        .lean()
}

module.exports = {
    findAllProducts,
    findProduct,
    findAllDraftsForShop,
    findAllProductByCategory,
    findAllProductByBrand,
    publishProductByAdmin,
    unPublishProductByAdmin,
    findAllProductsForAdmin,
    findProductsByPriceRange,
    updateProductById,
    checkProductByServer,
    filterProduct,
    findProductsByBrandId,
    textSearch
}