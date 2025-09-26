const AuthenticationService = require('../services/auth.service');
const { NotFoundError, AuthFailureError, BadRequestError, ForbiddenError } = require('../core/error.response');
const KeyTokenService = require('../services/keytoken.service');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs')
const { createTokenPair } = require('../auth/authUtils');

jest.mock('../models/repositories/user.repo', () => ({
  findUserByUserName: jest.fn(),
}));
jest.mock('../services/keytoken.service');
jest.mock('../auth/authUtils');
jest.mock('bcrypt');
jest.mock('../auth/authUtils', () => ({
  createTokenPair: jest.fn()
}))
describe('AuthenticationService', () => {
  describe('login', () => {
    it('should throw NotFoundError if user not found', async () => {
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue(null);
      await expect(AuthenticationService.login({ username: 'test', password: '123' }))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw AuthFailureError if password does not match', async () => {
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(AuthenticationService.login({ username: 'test', password: 'wrong' }))
        .rejects.toThrow(AuthFailureError);
    });
    it('should create new key token if key token not found', async () => {
      KeyTokenService.findByUserId.mockResolvedValue(null)
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue({ user_name: 'test', password: '123' })
      bcrypt.compare.mockResolvedValue(true)
      await createTokenPair.mockResolvedValue({ accessToken: "123", refreshToken: '1234' })
      const result = await AuthenticationService.login({ username: 'test', password: '123' })
      expect(result.tokens.accessToken).toBeTruthy()
      expect(result.tokens.refreshToken).toBeTruthy()
    })

    it('should return key token if key token exists', async () => {
      const updatedAt = dayjs(new Date())
      KeyTokenService.findByUserId.mockResolvedValue({ accessToken: '123', refreshToken: '1234', updatedAt })
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue({ user_name: 'test', password: '123' })
      bcrypt.compare.mockResolvedValue(true)
      const result = await AuthenticationService.login({ username: 'test', password: '123' })
      expect(result.tokens.accessToken).toBe('123')
      expect(result.tokens.refreshToken).toBe('1234')
    })

    it('should throw auth fail error if session expried', async () => {
      const updatedAt = dayjs('2025-09-21')
      KeyTokenService.findByUserId.mockResolvedValue({ accessToken: '123', refreshToken: '1234', updatedAt })
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue({ user_name: 'test', password: '123' })
      bcrypt.compare.mockResolvedValue(true)
      await expect(AuthenticationService.login({ username: 'test', password: '123' }))
        .rejects.toThrow(AuthFailureError)
    })
    it('should throw error when access token was expried ', async () => {
      const updatedAt = dayjs(new Date()).add(-1, 'day')
      console.log(updatedAt)
      KeyTokenService.findByUserId.mockResolvedValue({ accessToken: '123', refreshToken: '1234', updatedAt })
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue({ user_name: 'test', password: '123' })
      bcrypt.compare.mockResolvedValue(true)
      await expect(AuthenticationService.login({ username: 'test', password: '123' }))
        .rejects.toThrow(BadRequestError)
    })
  });

  describe('handleRefreshToken', () => {
    it('should throw ForbiddenError if refreshTokenUsed includes refreshToken', async () => {
      const keyStore = { refreshTokenUsed: ['abc'], refreshToken: 'def', updateOne: jest.fn() };
      await expect(AuthenticationService.handleRefreshToken({
        keyStore,
        refreshToken: 'abc',
        User: { userId: '1', username: 'test' }
      })).rejects.toThrow(ForbiddenError);
    });

    it('should throw AuthFailureError if refreshToken of database not equal refreshToken of user', async () => {
      const keyStore = { refreshTokenUsed: ['abc'], refreshToken: 'def', updateOne: jest.fn() };
      await expect(AuthenticationService.handleRefreshToken({
        keyStore,
        refreshToken: 'cdf',
        User: { userId: '1', username: 'test' }
      })).rejects.toThrow(AuthFailureError)
    })

    it('should throw AuthFailureError if user not found', async () => {
      const keyStore = { refreshTokenUsed: ['abc'], refreshToken: 'def', updateOne: jest.fn() }
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue(null)
      await expect(AuthenticationService.handleRefreshToken({
        keyStore,
        refreshToken: 'def',
        User: { userId: '1', username: 'test' }
      })).rejects.toThrow(AuthFailureError)
    })

    it('should return new key token if refresh token valid', async () => {
      const keyStore = { refreshTokenUsed: ['abc'], refreshToken: 'def', updateOne: jest.fn() }
      require('../models/repositories/user.repo').findUserByUserName.mockResolvedValue({user_name: 'test', phone: '123', roles: ['USER']})
      createTokenPair.mockResolvedValue({accessToken: "123", refreshToken: '1234'})
      const result = await AuthenticationService.handleRefreshToken({
        keyStore,
        refreshToken: 'def',
        User: { userId: '1', username: 'test' }
      })
      expect(result.tokens).not.toBeNull()
      expect(result.tokens.accessToken).toBe('123')
      expect(result.tokens.refreshToken).toBe('1234')
    })
  });

  describe('logOut', () => {
    it('should call removeKeyById', async () => {
      KeyTokenService.removeKeyById.mockResolvedValue(true);
      const result = await AuthenticationService.logOut({ _id: '1' });
      expect(result).toBe(true);
    });
  });

  describe('introspectToken', () => {
    it('should throw AuthFailureError if keyStore or User is missing', async () => {
      await expect(AuthenticationService.introspectToken({ keyStore: null, User: null }))
        .rejects.toThrow(AuthFailureError);
    });

    it('should return is_valid true if valid', async () => {
      const result = await AuthenticationService.introspectToken({ keyStore: {}, User: {} });
      expect(result).toEqual({ is_valid: true });
    });
  });
});