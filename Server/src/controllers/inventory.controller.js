const { SuccessResponse } = require("../core/success.response")

const InventoryService = require('../services/inventory.service')
class InventoryController {

    getAllInventory = async (req,res,next) => {
        new SuccessResponse({
            message: "All inventory",
            metadata: await InventoryService.getAllInventory({...req.params})
        }).send(res)
    }


    updateStock = async (req, res, next) => {
        new SuccessResponse({
            message: "Update stock",
            metadata: await InventoryService.updateStock({
                productId: req.params.productId,
                stock: req.body.stock
            })
        }).send(res)
    }

    findInventoryByProductId = async (req, res, next) => {
        new SuccessResponse({
            message: "Find inventory",
            metadata: await InventoryService.findInventoryByProductId(req.params)
        }).send(res)
    }
}


module.exports = new InventoryController()