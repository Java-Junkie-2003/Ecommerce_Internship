const { BadRequestError, NotFoundError } = require("../core/error.response");
const {getAllUserForAdmin, findUserByUserName, findUserByPhoneNumber} = require('../models/repositories/user.repo')
class UserService {
    
    static async getAllUserForAdmin() {
        return await getAllUserForAdmin()
    }

    static async getUserForAdmin({userName, phoneNumber}) {
        if(!userName) return new BadRequestError('Username is required')
        if(!phoneNumber)  return new BadRequestError('Phone is required')
        if(!userName && phoneNumber) return await findUserByPhoneNumber({
            phone: phoneNumber, 
            select: ['_id','user_name', 'email', 'phone']
        })
        if(!phoneNumber && userName) return await findUserByUserName({
            username: userName,
            select: ['_id','user_name', 'email', 'phone']
        })
    }
    
}

module.exports = UserService