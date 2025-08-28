const { getSelectData, getUnSelectData } = require('../../utils');
const orderModel = require('../order.model')

const findAllOrderByUserId = async ({ userId, limit, page, sort, unSelect = [] }) => {
    const safeLimit = Math.max(1, Number(limit) || 50);
    const safePage = Math.max(1, Number(page) || 1);
    const skip = (safePage - 1) * safeLimit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const [orders, total] = await Promise.all([
        orderModel.find({ order_userId: userId })
            .sort(sortBy)
            .skip(skip)
            .limit(safeLimit)
            .select(getUnSelectData(unSelect))
            .lean(),
        orderModel.countDocuments()
    ])

    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const hasNext = safePage < totalPages
    const hasPrev = safePage > 1
    return {
        orders,
        pagination: {
            totalOrders: total,
            count: orders.length,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNext,
            hasPrev,
            nextPage: hasNext ? safePage + 1 : null,
            prevPage: hasPrev ? safePage - 1 : null
        }
    }
}

const findAllOrdersByAdmin = async ({ limit, page, sort, unSelect = [] }) => {
    const safeLimit = Math.max(1, Number(limit) || 50);
    const safePage = Math.max(1, Number(page) || 1);
    const skip = (safePage - 1) * safeLimit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const [orders, total] = await Promise.all([
        orderModel.find()
            .sort(sortBy)
            .skip(skip)
            .limit(safeLimit)
            .select(getUnSelectData(unSelect))
            .lean(),
        orderModel.countDocuments()
    ])

    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const hasNext = safePage < totalPages
    const hasPrev = safePage > 1
    return {
        orders,
        pagination: {
            totalOrders: total,
            count: orders.length,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNext,
            hasPrev,
            nextPage: hasNext ? safePage + 1 : null,
            prevPage: hasPrev ? safePage - 1 : null
        }
    }
}

module.exports = {
    findAllOrderByUserId,
    findAllOrdersByAdmin
}