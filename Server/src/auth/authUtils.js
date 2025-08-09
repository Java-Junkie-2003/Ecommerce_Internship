const jwt = require('jsonwebtoken')
const asynHandler = require("../helpers/asyncHandler")
const { AuthFailureError, BadRequestError, NotFoundError, ForbiddenError } = require("../core/error.response");
const keyTokenService = require('../services/keytoken.service')
const HEADER = {
    CLIENT_ID:'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token'
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {expiresIn: '1 day'})
        const refreshToken = await jwt.sign(payload,privateKey,{expiresIn: '2 days'})
        return {
            accessToken,
            refreshToken
        }
    }catch(err){
        throw BadRequestError("Error Request!!")
    }
}

const authentication = asynHandler(async (req, res, next)=>{
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError("Invalid request!")
    const keyStore = await keyTokenService.findByUserId(userId)
    if(!keyStore) throw new NotFoundError("Keystore not found")
    if(req.headers[HEADER.REFRESH_TOKEN]){
        const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
        try {
            const decodedUser = jwt.verify(refreshToken, keyStore.privateKey);
            if(userId !== decodedUser.userId) throw new AuthFailureError('Invalid user!')
            req.keyStore = keyStore
            req.User = decodedUser
            req.refreshToken = refreshToken
            return next()
        }catch(err){
            throw err
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError("Invalid request")
    try {
          const decodedUser = jwt.verify(accessToken, keyStore.publicKey);
        if (userId !== decodedUser.userId) throw new AuthFailureError("Invalid user");
        req.keyStore = keyStore;
        req.User = decodedUser;
        return next();
    } catch (error) {
        throw new AuthFailureError('Invalid token')
    }
})

const verifyJWT = async (token, keySecret)=>{
    return await jwt.verify(token, keySecret)
}
module.exports = {
    createTokenPair,
    verifyJWT,
    authentication
}