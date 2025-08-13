const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require('dayjs')
const { BadRequestError, NotFoundError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findUserByPhoneNumber, findUserByUserName } = require('../models/repositories/user.repo')
const { createTokenPair } = require('../auth/authUtils');
const KeyTokenService = require("./keytoken.service");
const { genSecretKey, getInfoData } = require("../utils");

class AuthenticationService {
    static login = async ({ username, password }) => {
        const foundUser = await findUserByUserName({
            username,
            select: ["user_name", "email", "phone", "isActive", 'roles', 'password']
        })
        if (!foundUser) throw new NotFoundError("User Not Found !")
        const isMatch = await bcrypt.compare(password, foundUser.password)
        if (!isMatch) throw new AuthFailureError("Unauthorize!")
        const keyStore = await KeyTokenService.findByUserId(foundUser._id)
        if (!keyStore) {
            const { publicKey, privateKey } = genSecretKey();
            const tokens = await createTokenPair(
                {
                    userId: foundUser._id,
                    username,
                    roles: foundUser.roles
                },
                publicKey,
                privateKey
            )
            await KeyTokenService.createKeyToken(
                {
                    userId: foundUser._id,
                    publicKey,
                    privateKey,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            )

            return {
                user: getInfoData({ fields: ["_id", "user_name", "email", "phone", "isActive", "roles"], object: foundUser }),
                tokens
            }
        }
        const updateAt = dayjs(keyStore.updatedAt)
        const now = dayjs(new Date())
        if (now.isAfter(updateAt.add(2, 'days')) || now.isSame(updateAt.add(2, 'days'))) {
            KeyTokenService.deleteKeyTokenById(foundUser._id)
            throw new AuthFailureError("Session has been expried. Please login again !!")
        } else if (keyStore && (now.isAfter(updateAt) && now.isBefore(updateAt.add(2, 'days')))) {
            throw new BadRequestError("Token has been expried. Refresh token again !")
        }
    }
    static handleRefreshToken = async ({ keyStore, refreshToken, User }) => {
        const { userId, username } = User
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyTokenById(userId)
            throw new ForbiddenError("Something went wrong, please try again")
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Invalid refresh token !')
        const foundUser = await findUserByUserName({ username, select: ['username', 'phone'] })
        if (!foundUser) throw new AuthFailureError("Something went wrong !")
        const tokens = await createTokenPair({ userId, username, roles: foundUser.roles }, keyStore.publicKey, keyStore.privateKey)
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
                accessToken: tokens.accessToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        return {
            user: getInfoData({ fields: ["_id", "user_name", "email", "phone", "isActive", "roles"], object: foundUser }),
            tokens
        }
    }
    static logOut = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey;
    };
    static introspectToken = async ({ keyStore, User }) => {
        if (!keyStore || !User) throw new AuthFailureError("Invalid request");
        return {
            is_valid: true
        };
    };

}

module.exports = AuthenticationService
