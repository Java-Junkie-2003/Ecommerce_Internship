const AuthenticationService = require("../services/auth.service")
const {SuccessResponse} = require('../core/success.response')

class AuthenticationController {
    logIn = async (req, res, next) => {
        new SuccessResponse({
            message:"Login Successfully",
            metadata: await AuthenticationService.login(req.body)
        }).send(res)
    }

    logOut = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout successfully",
            metadata: await AuthenticationService.logOut(req.keyStore)
        }).send(res);
    };

    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Refresh token successfully",
            metadata: await AuthenticationService.handleRefreshToken({
                keyStore: req.keyStore,
                refreshToken: req.refreshToken,
                User: req.User,
            })
        }).send(res);
    };

    introspectToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Introspect token successfully",
            metadata: await AuthenticationService.introspectToken({ keyStore: req.keyStore, User: req.User })
        }).send(res);
    };

}

module.exports = new AuthenticationController()