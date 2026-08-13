// services/tokenService.js
// Ye file dono tokens ka "brain" hai

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const redis = require("../redisClient");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = process.env;

const BLACKLIST_PREFIX = "blacklist:"; // access token blacklist ke liye
const REFRESH_PREFIX = "refresh_token:"; // valid refresh tokens ke liye

// ------------------------------------------------------------------
// ACCESS TOKEN banao (short-lived, har request ke liye)
// ------------------------------------------------------------------
function generateAccessToken(user) {
  const jti = crypto.randomUUID(); // is token ki unique ID
  const token = jwt.sign(
    { userId: user.id, username: user.username, jti },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
  return token;
}

// ------------------------------------------------------------------
// REFRESH TOKEN banao (long-lived) aur Redis mein save karo
// Redis mein save karna zaroori hai — taaki hum ise revoke kar sakein
// (jaise "logout from all devices" waale case mein)
// ------------------------------------------------------------------
async function generateRefreshToken(user) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { userId: user.id, username: user.username, jti },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  // Redis mein is refresh token ki jti ko "valid" mark karo
  const key = REFRESH_PREFIX + jti;
  // Set TTL in seconds for 7 days
  const ttlSeconds = 7 * 24 * 60 * 60;
  await redis.set(key, user.id.toString(), "EX", ttlSeconds);

  return token;
}

// ------------------------------------------------------------------
// REFRESH TOKEN verify karo — signature check + Redis mein valid hai?
// ------------------------------------------------------------------
async function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET); // throws error agar invalid/expired

  const key = REFRESH_PREFIX + decoded.jti;
  const exists = await redis.get(key);

  if (!exists) {
    // Ho sakta hai already logout ho chuka ho, ya kabhi issue hi nahi hua
    throw new Error("Refresh token revoke ho chuka hai ya invalid hai");
  }

  return decoded;
}

// ------------------------------------------------------------------
// REFRESH TOKEN ko revoke karo (logout ke waqt)
// ------------------------------------------------------------------
async function revokeRefreshToken(jti) {
  const key = REFRESH_PREFIX + jti;
  await redis.del(key);
}

// ------------------------------------------------------------------
// ACCESS TOKEN ko blacklist karo (logout ke waqt)
// ------------------------------------------------------------------
async function blacklistAccessToken(jti, expiresInSeconds) {
  if (expiresInSeconds <= 0) return;
  const key = BLACKLIST_PREFIX + jti;
  await redis.set(key, "revoked", "EX", expiresInSeconds);
}

async function isAccessTokenBlacklisted(jti) {
  const key = BLACKLIST_PREFIX + jti;
  const result = await redis.get(key);
  return result !== null;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  blacklistAccessToken,
  isAccessTokenBlacklisted,
};
