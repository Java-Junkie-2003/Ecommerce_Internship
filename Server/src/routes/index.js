const express = require("express");
const router = express.Router();


router.use("/brand", require("./Brand"))
router.use("/category", require('./Category'))
router.use("/product", require('./Product'))
router.use("/auth", require("./Authenticate"));
router.use("/inventory", require("./Inventory"))
router.use('/cart', require('./Cart'))
module.exports = router