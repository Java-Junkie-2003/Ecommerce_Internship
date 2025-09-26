const KeyTokenService = require('../services/keytoken.service');
const keytokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');
jest.mock('../models/keytoken.model');

describe('KeyTokenService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createKeyToken', () => {
		it('should create and return publicKey', async () => {
			keytokenModel.findOneAndUpdate.mockResolvedValue({ publicKey: 'publicKey123' });
			const result = await KeyTokenService.createKeyToken({ userId: 'user1', publicKey: 'pub', privateKey: 'priv', accessToken: 'at', refreshToken: 'rt' });
			expect(result).toBe('publicKey123');
			expect(keytokenModel.findOneAndUpdate).toHaveBeenCalled();
		});
		it('should return error if exception thrown', async () => {
			keytokenModel.findOneAndUpdate.mockImplementation(() => { throw new Error('fail'); });
			const result = await KeyTokenService.createKeyToken({ userId: 'user1' });
			expect(result).toBeInstanceOf(Error);
		});
        it('should return null if key token null', async () => {
            keytokenModel.findOneAndUpdate.mockResolvedValue(null)
            const result = await KeyTokenService.createKeyToken({userId: 'user1'})
            expect(result).toBeNull()
        })
	});

	describe('findByUserId', () => {
		it('should find by user id', async () => {
			keytokenModel.findOne.mockResolvedValue({ user_name: 'user1' });
			const result = await KeyTokenService.findByUserId('68be511f453c53ec09212d3b');
			expect(result).toEqual({ user_name: 'user1' });
			expect(keytokenModel.findOne).toHaveBeenCalledWith({ user: new Types.ObjectId('68be511f453c53ec09212d3b') });
		});
	});

	describe('removeKeyById', () => {
		it('should remove key by id', async () => {
			keytokenModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
			const result = await KeyTokenService.removeKeyById('id1');
			expect(result).toEqual({ deletedCount: 1 });
			expect(keytokenModel.deleteOne).toHaveBeenCalledWith({ _id: 'id1' });
		});
	});

	describe('findByRefreshTokenUsed', () => {
		it('should find by refreshTokenUsed', async () => {
			keytokenModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ refreshTokenUsed: ['rt'] }) });
			const result = await KeyTokenService.findByRefreshTokenUsed('rt');
			expect(result).toEqual({ refreshTokenUsed: ['rt'] });
			expect(keytokenModel.findOne).toHaveBeenCalledWith({ refreshTokenUsed: { $in: ['rt'] } });
		});
	});

	describe('findByRefreshToken', () => {
		it('should find by refreshToken', async () => {
			keytokenModel.findOne.mockResolvedValue({ refreshToken: 'rt' });
			const result = await KeyTokenService.findByRefreshToken('rt');
			expect(result).toEqual({ refreshToken: 'rt' });
			expect(keytokenModel.findOne).toHaveBeenCalledWith({ refreshToken: 'rt' });
		});
	});

	describe('deleteKeyTokenById', () => {
		it('should delete key token by userId', async () => {
			keytokenModel.deleteOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ deletedCount: 1 }) });
			jest.spyOn(require('../utils'), 'convertToObjectId').mockReturnValue('68be511f453c53ec09212d3b');
			const result = await KeyTokenService.deleteKeyTokenById('68be511f453c53ec09212d3b');
			expect(result).toEqual({ deletedCount: 1 });
			expect(keytokenModel.deleteOne).toHaveBeenCalledWith({ user: new Types.ObjectId('68be511f453c53ec09212d3b') });
		});
	});
});
