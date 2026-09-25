import express from "express";

import {
  register,
  login,
  verifyEmail,
  getMe,
  logout,
  refreshAccessToken,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import validationMiddleware from "../middlewares/validation.middleware.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, validationMiddleware, register);

router.post("/login", loginValidator, validationMiddleware, login);
router.get("/verify-email", verifyEmail);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/get-me", authMiddleware, getMe);

router.post("/refresh", refreshAccessToken);

router.post("/logout", authMiddleware, logout);

export default router;
