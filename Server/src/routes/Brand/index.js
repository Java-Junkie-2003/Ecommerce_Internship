const express = require('express')
const router = express.Router()

const brandController = require('../../controllers/band.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication, authenticatorForRoleAdmin } = require('../../auth/authUtils')


router.get("/all", asyncHandler(brandController.getAllBrand))

router.use(authentication)
router.use(authenticatorForRoleAdmin)

router.post("/create-brand", asyncHandler(brandController.createBrand))

module.exports = router