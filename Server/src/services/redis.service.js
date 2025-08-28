
const {redisClient} = require('../configs/redis.config')
const { reservationInventory } = require('../models/repositories/inventory.repo')


const LOCK_TTL = 3000;
const RETRIES  = 10;
const SLEEP_MS = 50;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function acquireLock(productId, quantity, userId) {
  const key   = `lock_v2023_${productId}`;
  const token = `${userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

  for (let i = 0; i < RETRIES; i++) {
    const ok = await redisClient.set(key, token, { NX: true, PX: LOCK_TTL });
    if (ok) {
      const r = await reservationInventory({ productId, quantity, userId });
      if (r?.modifiedCount) {
        return { key, token };
      } else {
        await releaseLock(key, token);
        return null;
      }
    }
    await sleep(SLEEP_MS);
  }
  return null;
}

async function releaseLock(key, token) {
  for (let i = 0; i < 3; i++) {
    await redisClient.watch(key);
    const val = await redisClient.get(key);
    if (val !== token) {
      await redisClient.unwatch();
      return 0
    }
    const tx = redisClient.multi();
    tx.del(key);
    const res = await tx.exec()
    if (res !== null) {

      return res[0];
    }
  }
  return 0;
}

module.exports = { acquireLock, releaseLock };