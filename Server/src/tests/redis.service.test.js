
jest.mock('../configs/redis.config', () => ({
    redisClient: {
        set: jest.fn(),
        get: jest.fn(),
        watch: jest.fn(),
        unwatch: jest.fn(),
        multi: jest.fn(),
    }
}));
jest.mock('../models/repositories/inventory.repo', () => ({
    reservationInventory: jest.fn(),
}));

const { redisClient } = require('../configs/redis.config');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const RedisService = require('../services/redis.service');

describe('redis.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('acquireLock', () => {
    it('should acquire lock and reserve inventory', async () => {
      redisClient.set.mockResolvedValue(true);
      reservationInventory.mockResolvedValue({ modifiedCount: 1 });
      const result = await RedisService.acquireLock('p1', 2, 'u1');
      expect(result).toHaveProperty('key', expect.stringContaining('lock_v2023_p1'));
      expect(result).toHaveProperty('token', expect.stringContaining('u1:'));
      expect(redisClient.set).toHaveBeenCalled();
      expect(reservationInventory).toHaveBeenCalledWith({ productId: 'p1', quantity: 2, userId: 'u1' });
    });

    it('should release lock and return null if inventory not reserved', async () => {
      redisClient.set.mockResolvedValue(true);
      reservationInventory.mockResolvedValue({modifiedCount: 0});
      const result = await RedisService.acquireLock('p1', 2, 'u1');
      expect(result).toBeNull();
    });

    it('should return null if cannot acquire lock after retries', async () => {
      redisClient.set.mockResolvedValue(false);
      const result = await RedisService.acquireLock('p1', 2, 'u1');
      expect(result).toBeNull();
      expect(redisClient.set).toHaveBeenCalled();
    });
  });

  describe('releaseLock', () => {
    it('should release lock if token matches', async () => {
      redisClient.watch.mockResolvedValue();
      redisClient.get.mockResolvedValue('token123');
      redisClient.unwatch.mockResolvedValue();
      const tx = { del: jest.fn(), exec: jest.fn().mockResolvedValue([1]) };
      redisClient.multi.mockReturnValue(tx);
      const result = await RedisService.releaseLock('key1', 'token123');
      expect(redisClient.watch).toHaveBeenCalledWith('key1');
      expect(redisClient.get).toHaveBeenCalledWith('key1');
      expect(tx.del).toHaveBeenCalledWith('key1');
      expect(result).toBe(1);
    });

    it('should return 0 if token does not match', async () => {
      redisClient.watch.mockResolvedValue();
      redisClient.get.mockResolvedValue('wrongtoken');
      redisClient.unwatch.mockResolvedValue();
      const result = await RedisService.releaseLock('key1', 'token123');
      expect(redisClient.unwatch).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it('should return 0 if exec returns null', async () => {
      redisClient.watch.mockResolvedValue();
      redisClient.get.mockResolvedValue('token123');
      redisClient.unwatch.mockResolvedValue();
      const tx = { del: jest.fn(), exec: jest.fn().mockResolvedValue(null) };
      redisClient.multi.mockReturnValue(tx);
      const result = await RedisService.releaseLock('key1', 'token123');
      expect(result).toBe(0);
    });
  });
});
