const {findAllOrderByUserId, findAllOrdersByAdmin, statTotalCheckout, updateOrderStatus} = require('../models/repositories/order.repo')

class OrderSerivce {
    static async findAllOrderByUserId({userId, limit = 10, page = 1, sort='ctime'}){
        return await findAllOrderByUserId({userId, limit, page, sort, unSelect: ['__v'] })
    }

    static async findAllOrdersForAdmin({limit = 10, page = 1, sort='ctime'}){
        return await findAllOrdersByAdmin({limit, page, sort, unSelect: ['__v']})
    }

    static async statTotalCheckout({userId ,scope, year, month}){
        return await statTotalCheckout({userId, scope, year, month})
    }
    static async updateOrderStatus({orderId}){
        return await updateOrderStatus({orderId})
    }
}

module.exports = OrderSerivce