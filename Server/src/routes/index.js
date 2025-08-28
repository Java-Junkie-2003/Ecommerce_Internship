const express = require("express");
const router = express.Router();


router.use("/brand", require("./Brand"))
router.use("/category", require('./Category'))
router.use("/product", require('./Product'))
router.use("/auth", require("./Authenticate"));
router.use("/inventory", require("./Inventory"))
router.use('/cart', require('./Cart'))
router.use('/address', require('./Address'))
router.use('/checkout', require('./Checkout'))
router.use('/order', require('./Order'))
router.use('/payment', require('./Payment'))

module.exports = router