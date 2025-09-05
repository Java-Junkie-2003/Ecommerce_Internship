const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { convertToObjectId } = require('../../utils')
const { Types } = require('mongoose')
const brandModel = require('../brand.model')
const { product } = require('../product.model')

const createBrand = async ({ brand_name, brand_icon }) => {
    const newBrand = await brandModel.create({ brand_name, brand_icon })
    if (!newBrand) throw new BadRequestError("Can't create now!")
    return newBrand
}

const getAllBrand = async () => {
    return await brandModel.find();
}

const updateBrand = async ({ brand_id, brand_name, brand_icon }) => {
    const bodyUpdate = {}
    if (brand_name) bodyUpdate.brand_name = brand_name
    if (brand_icon) bodyUpdate.brand_icon = brand_icon
    return await brandModel.updateOne({ _id: brand_id }, {
        brand_name,
        brand_icon
    }, { upsert: true, new: true })
}

const unPublishBrand = async ({ brand_id }) => {
    const id = Types.ObjectId.isValid(brand_id) ? convertToObjectId(brand_id) : brand_id;

    const brand = await brandModel.findById(id).lean();
    if (!brand) throw new NotFoundError('Brand not found');

    const brandRes = await brandModel.updateOne(
        { _id: id, isPublished: { $ne: false } },
        { $set: { isPublished: false } }
    );

    const prodRes = await product.updateMany(
        { product_brand: id, isPublished: true },
        { $set: { isPublished: false, isDraft: true } }
    );

    return {
        brandUpdated: brandRes.modifiedCount,
        productsMatched: prodRes.matchedCount,
        productsUpdated: prodRes.modifiedCount
    };
};

module.exports = {
    createBrand,
    getAllBrand,
    updateBrand,
    unPublishBrand
}