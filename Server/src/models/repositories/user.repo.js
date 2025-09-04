const userModel = require("../user.model")
const { getSelectData, convertToObjectId } = require('../../utils')
const { NotFoundError } = require("../../core/error.response")

const findUserByPhoneNumber = async ({ phone, select }) => {
    return await userModel.findOne({ phone }).select(getSelectData(select)).lean()
}

const findUserByUserName = async ({username, select ={}}) => {
    return await userModel.findOne({user_name: username})
    .select(getSelectData(select))
    .lean()
}

const findUserById = async ({userId}) => {
    return await userModel.findById({_id: userId}).lean();
}

const getAllUserForAdmin = async () => {
    return await userModel.find({}).lean()
}


module.exports = {
    findUserByPhoneNumber,
    findUserByUserName,
    findUserById,
    getAllUserForAdmin
}