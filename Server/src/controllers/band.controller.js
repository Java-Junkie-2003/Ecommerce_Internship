

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
}

module.exports = new BrandController()