// redis.client.js
const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis error:', err));

if (process.env.NODE_ENV !== "test") {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    redisClient.on("connect", () => console.log("Redis Client Connected"));

    (async () => {
        try {
            await redisClient.connect()
        } catch (error) {
            console.error("Failed to connect to Redis:", error);
        }
    })();
}


module.exports = { redisClient};
