const express = require('express')
const router = express.Router()
const {authentication, authenticatorForRoleAdmin} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const UserController = require('../../controllers/user.controller')

router.use(authentication)
router.use(authenticatorForRoleAdmin)

router.get('',asyncHandler(UserController.getUserForAdmin))
router.get('/all', asyncHandler(UserController.getAllUserForAdmin))
router.get('/find/:userId', asyncHandler(UserController.getUserById))


module.exports = router