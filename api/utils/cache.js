const redis = require("./redisClient");

// Default TTL in seconds (change only here)
const DEFAULT_TTL = 60 * 60 * 24; // 24 hours

module.exports = {
    async getCache(key) {
        console.log("GET →", key);
        const data = await redis.get(key);
        console.log("GET RESULT →", data);
        return data ? JSON.parse(data) : null;
    },

    async setCache(key, value, ttl = DEFAULT_TTL) {
        console.log("SET →", key, "TTL:", ttl);
        await redis.set(
            key,
            JSON.stringify(value),
            { EX: ttl }   // TTL in seconds
        );
        console.log("SET DONE");
    },

    async deleteCache(key) {
        console.log("DEL →", key);
        await redis.del(key);
    }
};
