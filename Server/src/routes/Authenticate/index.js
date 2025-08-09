const express = require('express')
const router = express.Router()
const AuthController = require('../../controllers/auth.controller')
const {authentication} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')


router.post('/auth/login', asyncHandler(AuthController.logIn))

router.use(authentication)
router.get('/auth/logout', asyncHandler(AuthController.logOut))
router.get("/auth/introspect-token", asyncHandler(AuthController.introspectToken));
router.post("/auth/refreshtoken", asyncHandler(AuthController.handleRefreshToken));

module.exports = router