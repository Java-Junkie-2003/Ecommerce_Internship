const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const objectSupport = require('dayjs/plugin/objectSupport');

const { getSelectData, getUnSelectData, convertToObjectId } = require('../../utils');
const orderModel = require('../order.model')
const { NotFoundError } = require('../../core/error.response')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)
const TZ = 'Asia/Ho_Chi_Minh'

dayjs.tz.setDefault(TZ)

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
            .populate('order_userId', 'user_name phone -_id')
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

const statTotalCheckout = async ({ scope = 'month', year, month, paidOnly = true } = {}) => {
    const now = dayjs.tz()
    const y = Number(year) || now.year()
    const m = Number(month) || (now.month() + 1)

    const match = {}
    if (paidOnly) match.payment_status = 'PAID'

    let start, end, groupFmt

    if (scope === 'month') {
        start = dayjs.tz({ year: y, month: 0, date: 1 }).startOf('day')
        end = start.add(1, 'year')
        groupFmt = '%Y-%m'
    } else if (scope === 'day') {
        start = dayjs.tz({ year: y, month: m - 1, date: 1 }).startOf('day')
        end = start.add(1, 'month')
        groupFmt = '%Y-%m-%d'
    } else {
        groupFmt = '%Y'
    }

    if (start && end) {
        match.createdAt = { $gte: start.toDate(), $lt: end.toDate() }
    }

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id: { $dateToString: { format: groupFmt, date: '$createdAt', timezone: TZ } },
                totalCheckout: { $sum: '$order_checkout.totalCheckout' },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]

    return orderModel.aggregate(pipeline)
}

const updateOrderStatus = async ({ orderId }) => {
    const updated = await orderModel.findByIdAndUpdate(
        convertToObjectId(orderId),
        {$set: {payment_status: "PAID", order_status: "DELIVERIED"}},
        {new: true, upsert: true}
    )
    if(!updated) throw new NotFoundError("Order not found !!!")
    return updated
}
module.exports = {
    findAllOrderByUserId,
    findAllOrdersByAdmin,
    statTotalCheckout,
    updateOrderStatus
}