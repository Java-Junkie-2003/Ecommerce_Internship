
const { convertToObjectId, getSelectData } = require('../../utils')
const inventory = require('../inventory.model')

const {Types} = require('mongoose')


const insertInventory = async ({productId, stock, location = 'Unknown'}) => {
    return await inventory.create({
        inven_product: convertToObjectId(productId),
        inven_location: location,
        inven_stock: stock
    })
}

const getAllInventory = async ({limit, page, sort, select = []}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await inventory.find({})
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate("inven_product", "product_name _id")
    .select(getSelectData(select))
}

const updateStockForProduct = async({productId, stock, isNew = true}) =>{
    const numStock = Number(stock)
    return await inventory.findOneAndUpdate({inven_product: convertToObjectId(productId)}, {
        inven_stock: numStock
    }, {new: isNew})
}
const findInvenByProductId = async({productId}) => {
    return await inventory.findOne({inven_product: productId}).lean()
}

const reservationInventory = async ({productId, quantity, userId}) => {
    const query = {
        inven_product: convertToObjectId(productId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                user_id: userId,
                createdOn: new Date()
            }
        }

    }, options ={upsert: true, new: true}
    
    return await inventory.updateOne(query, updateSet, options)
}
module.exports = {
    insertInventory,
    getAllInventory,
    updateStockForProduct,
    findInvenByProductId,
    reservationInventory
}