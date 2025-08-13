const express = require("express");
const router = express.Router();


router.use("/v1/api/product", require('./Product'))
router.use("/v1/api", require("./Authenticate"));


module.exports = router