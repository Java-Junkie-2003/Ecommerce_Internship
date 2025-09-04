const UserService = require('../services/user.service')
const {getAllUserForAdmin} = require('../models/repositories/user.repo')
const {SuccessResponse} = require('../core/success.response')
class UserController {
    getAllUserForAdmin = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all user',
            metadata: await UserService.getAllUserForAdmin()
        }).send(res)
    }
    getUserForAdmin = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get user for admin',
            metadata: await UserService.getUserForAdmin(req.query)
        }).send(res)
    }
}

module.exports = new UserController()