
const {getAllInventory, updateStockForProduct} = require('../models/repositories/inventory.repo')

class InventoryService {

    static getAllInventory = async ({limit = 50, page = 1, sort = 'ctime'}) => {
        return await getAllInventory({limit, page, sort, select: ['inven_product', 'inven_stock', 'inven_location']})
    }

    static updateStock = async ({productId, stock}) => {
        return await updateStockForProduct({productId, stock})
    }
}


module.exports = InventoryService