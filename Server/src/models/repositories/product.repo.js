const { product } = require('../product.model')
const {Types} = require('mongoose')
require('../brand.model')
require('../category.model')
const { getSelectData, getUnSelectData, convertToObjectId } = require('../../utils')
const productModel = require('../product.model')
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

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
        .populate("product_brand", "brand_name brand_icon -_id")
        .populate("product_categories", "category_name -_id")
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

const unPublishProductByAdmin =async ({ product_id }) => {
    if (!Types.ObjectId.isValid(product_id)) return null;

    const doc = await product.findById(product_id);
    if (!doc) return null;

    doc.set({ isPublished: false, isDraft: true });
    await doc.save();      
    return 1;
};
const findAllProductsForAdmin = async ({ limit, sort, page, filter, select }) => {
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

const findProductsByPriceRange= async ({minPrice, maxPrice, limit, page, sort, select = []}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find({product_price: {$gte: minPrice, $lte: maxPrice}})
    .populate("product_brand", "brand_name brand_icon -_id")
    .populate("product_categories", "category_name -_id")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    return products
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
    findProductsByPriceRange
}