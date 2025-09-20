const { SuccessResponse } = require('../core/success.response')
const CategoryService = require('../services/category.service')


class CategoryController {
    createCategoryForAdmin = async(req, res, next) =>{
        new SuccessResponse({
            message: "Create Successful",
            metadata: await CategoryService.createCategory(req.body)
        }).send(res)
    }

    getAllCategory = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all category",
            metadata: await CategoryService.getAllCategory()
        }).send(res)
    }

    updateCategory = async (req, res, next) => {
        new SuccessResponse({
            message: "Update category",
            metadata: await CategoryService.updateCategory({
                category_id: req.params.categoryId,
                category_name: req.body.category_name
            })
        }).send(res)
    }
}


module.exports = new CategoryController()