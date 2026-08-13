const jwt = require("jsonwebtoken");
const {
  isAccessTokenBlacklisted,
} = require("../services/tokenService");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        error: "Access token nahi mila",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const blacklisted = await isAccessTokenBlacklisted(
      decoded.jti
    );

    if (blacklisted) {
      return res.status(401).json({
        error: "Ye token revoke ho chuka hai",
      });
    }

    req.user = decoded;

    next();

  } catch (err) {

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Access token expire ho gaya",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      error: "Invalid access token",
    });
  }
}

module.exports = authMiddleware;