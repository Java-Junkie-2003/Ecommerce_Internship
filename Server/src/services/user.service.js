const { BadRequestError, NotFoundError } = require("../core/error.response");
const { getAllUserForAdmin, findUserByUserName, findUserByPhoneNumber, findUserById } = require('../models/repositories/user.repo')
class UserService {

    static async getAllUserForAdmin() {
        return await getAllUserForAdmin()
    }

    static async getUserForAdmin({ userName, phoneNumber }) {
        if (!userName && phoneNumber) {
            return await findUserByPhoneNumber({
                phone: phoneNumber,
                select: ['_id', 'user_name', 'email', 'phone']
            })
        }
        if (!phoneNumber && userName) {
            return await findUserByUserName({
                username: userName,
                select: ['_id', 'user_name', 'email', 'phone']
            })
        }
    }

    static async getUserById({ userId }) {
        const foundUser = await findUserById({ userId, select: ['_id', 'user_name', 'email', 'phone'] })
        if (!foundUser) return new NotFoundError("User not found !!!")
        return foundUser
    }

}

module.exports = UserService