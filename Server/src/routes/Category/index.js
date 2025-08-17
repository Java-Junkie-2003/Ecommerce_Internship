const express = require('express')
const router = express.Router()

const {authentication, authenticatorForRoleAdmin} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const categoryController = require('../../controllers/category.controller')


router.get("/all", asyncHandler(categoryController.getAllCategory))

router.use(authentication)
router.use(authenticatorForRoleAdmin)

router.post("/create", asyncHandler(categoryController.createCategoryForAdmin))

module.exports = router