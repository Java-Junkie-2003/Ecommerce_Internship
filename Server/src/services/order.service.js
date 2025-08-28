const {findAllOrderByUserId, findAllOrdersByAdmin} = require('../models/repositories/order.repo')

class OrderSerivce {
    static async findAllOrderByUserId({userId, limit = 10, page = 1, sort='ctime'}){
        return await findAllOrderByUserId({userId, limit, page, sort, unSelect: ['__v'] })
    }

    static async findAllOrdersForAdmin({limit = 10, page = 1, sort='ctime'}){
        return await findAllOrdersByAdmin({limit, page, sort, unSelect: ['__v']})
    }
}

module.exports = OrderSerivce