const mongoose = require('mongoose')
const { BadRequestError } = require('../../core/error.response')
const categoryModel = require('../category.model')
const { convertToObjectId } = require('../../utils')


const createCategory = async ({ category_name }) => {
    const newCategory = await categoryModel.create({ category_name })
    if (!newCategory) throw new BadRequestError("Invalid request !!")
    return newCategory;
}

const getAllCategory = async () => {
    return await categoryModel.find()
}

const updateCategory = async ({ category_id, category_name }) => {
    const bodyUpdate = {}
    if (!category_id || !mongoose.isValidObjectId(category_id)) throw new BadRequestError("Invalid request !!!")
    if (category_name) bodyUpdate.category_name = category_name
    return await categoryModel.updateOne({ _id: category_id }, bodyUpdate, {
        upsert: true,
        new: true
    })
}
module.exports = {
    createCategory,
    getAllCategory,
    updateCategory
}