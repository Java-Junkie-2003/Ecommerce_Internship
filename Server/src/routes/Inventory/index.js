const express = require('express')
const router = express.Router()

const InventoryController = require('../../controllers/inventory.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication, authenticatorForRoleAdmin } = require('../../auth/authUtils')


router.use(authentication)
router.use(authenticatorForRoleAdmin)
router.get('/', asyncHandler(InventoryController.getAllInventory))
router.post('/update-stock/:productId', asyncHandler(InventoryController.updateStock))


module.exports = router