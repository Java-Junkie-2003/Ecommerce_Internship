
const {createCategory, getAllCategory}= require('../models/repositories/category.repo')

class CategoryService {
    static createCategory = async ({category_name}) => {
       return await createCategory({category_name})
    }

    static getAllCategory = async() => {
        return await getAllCategory()
    }
}


module.exports = CategoryService