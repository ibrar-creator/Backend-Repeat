// controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userStore = require("../services/userStore");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  blacklistAccessToken,
} = require("../services/tokenService");

// ------------------------------------------------------------------
// REGISTER
// ------------------------------------------------------------------
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email aur password zaroori hain",
      });
    }

    const existingUserByEmail = await userStore.findByEmail(email);
    const existingUserByUsername = await userStore.findByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({
        error: "Ye username ya email pehle se use ho raha hai",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userStore.createUser({
      username,
      email,
      hashedPassword,
    });

    // Automatically login
    const accessToken =
      generateAccessToken(newUser);

    const refreshToken =
      await generateRefreshToken(newUser);

    // Access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    return next(error);
  }
}

// ------------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------------
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Username aur password zaroori hai",
      });
    }

    const user = await userStore.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "Galat email ya password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Galat username ya password",
      });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = await generateRefreshToken(user);

    // Access Token Cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Login failed",
    });
  }
}

// ------------------------------------------------------------------
// REFRESH
// ------------------------------------------------------------------
async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      error: "Refresh token nahi mila",
    });
  }

  try {
    const decoded = await verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      id: decoded.userId,
      username: decoded.username,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: "Access token refresh ho gaya",
    });

  } catch (error) {
    return res.status(401).json({
      error: "Refresh token invalid ya expire ho chuka hai",
    });
  }
}

// ------------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------------
async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    // authMiddleware se decoded access token
    const accessTokenDecoded = req.user;

    // Access token blacklist
    const remainingSeconds =
      accessTokenDecoded.exp -
      Math.floor(Date.now() / 1000);

    if (remainingSeconds > 0) {
      await blacklistAccessToken(
        accessTokenDecoded.jti,
        remainingSeconds
      );
    }

    // Refresh token revoke
    if (refreshToken) {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        await revokeRefreshToken(decodedRefresh.jti);
      } catch (err) {
        console.log("Refresh token already invalid/revoked");
      }
    }

    // Cookies delete
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "Logout successful. Dono tokens revoke ho gaye.",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      error: "Logout failed",
    });
  }
}
async function getMe(req, res) {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      error: "User information nahi mil saki",
    });
  }
}
module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};