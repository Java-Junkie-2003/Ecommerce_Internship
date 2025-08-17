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
        })
    }
}


module.exports = new CategoryController()