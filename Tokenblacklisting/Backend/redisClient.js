// redisClient.js
// Redis yahan 2 kaam ke liye use hoga:
// 1. Refresh tokens ko store karna (taaki hum unhe kabhi bhi revoke kar sakein)
// 2. Blacklisted access tokens rakhna (logout ke baad)

const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));

module.exports = redis;