const redis = require("./redisClient");

module.exports = {
    async getCache(key) {
        console.log("GET →", key);
        let data = await redis.get(key);
        console.log("GET RESULT →", data);
        return data ? JSON.parse(data) : null;
    },

    async setCache(key, value, ttl = 60) {
        console.log("SET →", key, "TTL:", ttl);
        await redis.set(key, JSON.stringify(value), { EX: ttl });
        console.log("SET DONE");
    },

    async deleteCache(key) {
        console.log("DEL →", key);
        await redis.del(key);
    }
};
