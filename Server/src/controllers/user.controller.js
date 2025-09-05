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
    getUserById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get user by id for admin',
            metadata: await UserService.getUserById(req.params)
        }).send(res)
    }
}

module.exports = new UserController()