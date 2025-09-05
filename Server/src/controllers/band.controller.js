

const { SuccessResponse } = require("../core/success.response")
const brandService = require("../services/brand.service")

class BrandController {
    createBrand = async(req,res,next) =>{
        new SuccessResponse({
            message: "Create brand",
            metadata: await brandService.createBrand(req.body)
        }).send(res)
    }

    getAllBrand = async (req, res, next) =>{
        new SuccessResponse({
            message: "Get all brand",
            metadata: await brandService.getAllBrand()
        }).send(res)
    }

    updateBrand = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update brand',
            metadata: await brandService.updateBrand({
                brand_id: req.params.brandId,
                ...req.body
            })
        }).send(res)
    }

    unPublishBrand = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish brand',
            metadata: await brandService.unPublish({brand_id: req.params.brandId})
        }).send(res)
    }
}

module.exports = new BrandController()