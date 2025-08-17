const express = require('express')
const router = express.Router()
const AuthController = require('../../controllers/auth.controller')
const {authentication} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')


router.post('/login', asyncHandler(AuthController.logIn))

router.use(authentication)
router.get('/logout', asyncHandler(AuthController.logOut))
router.get("/introspect-token", asyncHandler(AuthController.introspectToken));
router.post("/refreshtoken", asyncHandler(AuthController.handleRefreshToken));

module.exports = router