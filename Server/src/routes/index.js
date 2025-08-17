const express = require("express");
const router = express.Router();


router.use("/brand", require("./Brand"))
router.use("/category", require('./Category'))
router.use("/product", require('./Product'))
router.use("/auth", require("./Authenticate"));


module.exports = router