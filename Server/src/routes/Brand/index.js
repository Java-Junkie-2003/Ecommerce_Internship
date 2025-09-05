const express = require('express')
const router = express.Router()

const brandController = require('../../controllers/band.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication, authenticatorForRoleAdmin } = require('../../auth/authUtils')
const bandController = require('../../controllers/band.controller')


router.get("/all", asyncHandler(brandController.getAllBrand))

router.use(authentication)
router.use(authenticatorForRoleAdmin)
router.post('/unpublish/:brandId', asyncHandler(bandController.unPublishBrand))
router.post("/create-brand", asyncHandler(brandController.createBrand))
router.put('/update/:brandId', asyncHandler(brandController.updateBrand))
module.exports = router