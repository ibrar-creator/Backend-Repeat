import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendEmail } from "../services/mail.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
  

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,

      isVerified: false,

      emailVerificationToken: verificationToken,

    });
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    const verificationUrl = `${apiUrl}/api/auth/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,

      subject: "Verify your Perplexity Clone account",

      html: `
    <h2>Welcome ${user.username} 👋</h2>

    <p>
      Please verify your email address.
    </p>

    <a href="${verificationUrl}">
      Verify Email
    </a>
  `,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    const loginUrl = process.env.CLIENT_LOGIN_URL || `${apiUrl}/login`;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

    // Already verified
    if (user.isVerified) {
      if (req.accepts("html")) {
        return res.redirect(loginUrl);
      }

      return res.status(200).json({
        alreadyVerified: true,
        message: "Email is already verified",
        redirectTo: loginUrl,
      });
    }


    user.isVerified = true;

    user.emailVerificationToken = null;


    await user.save();

    if (req.accepts("html")) {
      return res.redirect(loginUrl);
    }

    return res.status(200).json({
      verified: true,
      message: "Email verified successfully",
      redirectTo: loginUrl,
    });
  } catch (error) {
    console.error("Verify email error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({
        alreadyVerified: true,
        message: "Email is already verified",
      });
    }

    // Generate NEW token
    const verificationToken =
      generateVerificationToken();

    user.emailVerificationToken =
      verificationToken;

    await user.save();

    const apiUrl = process.env.API_URL || "http://localhost:3000";
    const verificationUrl =
      `${apiUrl}/api/auth/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,

      subject: "Verify your Perplexity Clone account",

      html: `
        <h2>Verify your email 📧</h2>

        <p>
          Click the button below to verify your email.
        </p>

        <a href="${verificationUrl}">
          Verify Email
        </a>

      `,
    });

    return res.status(200).json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error(
      "Resend verification error:",
      error
    );

    return res.status(500).json({
      message: "Failed to send verification email",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        success: false,
        err: "Email not verified",
      });
    }

    // Create JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = generateAccessToken({
      _id: decoded.userId,
    });

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Access token refreshed",
      });
  } catch (error) {
    return res.status(401).json({
      message: "Refresh token expired or invalid",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({
      message: "Logout successful",
    });
};
