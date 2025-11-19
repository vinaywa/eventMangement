// utils/redisClient.js
const { createClient } = require("redis");

const client = createClient({
    url: "redis://127.0.0.1:6379"
});

// Log errors
client.on("error", (err) => {
    console.error("❌ Redis Client Error:", err);
});

// Ensure single connection
let isConnected = false;

async function connectRedis() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
        console.log("✅ Redis Connected");
    }
}

connectRedis();

module.exports = client;
