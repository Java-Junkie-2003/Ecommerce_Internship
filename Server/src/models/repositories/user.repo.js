const userModel = require("../user.model")
const { getSelectData, convertToObjectId, getUnSelectData } = require('../../utils')
const { NotFoundError } = require("../../core/error.response")

const findUserByPhoneNumber = async ({ phone, select }) => {
    return await userModel.findOne({ phone }).select(getSelectData(select)).lean()
}

const findUserByUserName = async ({ username, select = {} }) => {
    return await userModel.findOne({ user_name: username })
        .select(getSelectData(select))
        .lean()
}

const findUserById = async ({ userId, select = [] }) => {
    return await userModel.findById({ _id: userId })
        .select(getSelectData(select))
        .lean();
}

const getAllUserForAdmin = async ({ userId, limit, page, sort }) => {
    const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: -1 }
    const limitNum = Math.max(1, Number(limit) || 10)
    const pageNum = Math.max(1, Number(page) || 1)
    const skip = (pageNum - 1) * limitNum
    const [results, total] = await Promise.all([
        await userModel.find({ _id: { $ne: convertToObjectId(userId) } })
            .sort(sortBy)
            .skip(skip)
            .limit(limitNum)
            .select(getUnSelectData(['isActive', 'password']))
            .lean()
            .exec(),
        userModel.countDocuments({ _id: { $ne: convertToObjectId(userId) } })
    ])

    const totalPages = Math.max(1, Math.ceil(total / limitNum))
    const hasNext = pageNum < totalPages
    const hasPrev = pageNum > 1

     return {
        results,
        pagination: {
            totalResult: total,
            page: pageNum,
            limit: limitNum,
            totalPages,
            hasNext,
            hasPrev
        }
    }
}


module.exports = {
    findUserByPhoneNumber,
    findUserByUserName,
    findUserById,
    getAllUserForAdmin
}