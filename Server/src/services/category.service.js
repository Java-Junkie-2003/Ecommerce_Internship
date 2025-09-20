
const {createCategory, getAllCategory, updateCategory}= require('../models/repositories/category.repo')

class CategoryService {
    static createCategory = async ({category_name}) => {
       return await createCategory({category_name})
    }

    static getAllCategory = async() => {
        return await getAllCategory()
    }

    static updateCategory = async ({category_id, category_name}) => {
        return await updateCategory({category_id, category_name})
    }
}


module.exports = CategoryService