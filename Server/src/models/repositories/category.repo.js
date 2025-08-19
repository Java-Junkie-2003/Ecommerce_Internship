const { BadRequestError } = require('../../core/error.response')
const categoryModel = require('../category.model')


const createCategory = async ({category_name}) =>{
    const newCategory = await categoryModel.create({category_name})
    if(!newCategory) throw new BadRequestError("Invalid request !!")
    return newCategory;
}

const getAllCategory = async () => {
    return await categoryModel.find()
}


module.exports = {
    createCategory,
    getAllCategory
}