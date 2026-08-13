// routes/authRoutes.js

const express = require("express");
const router = express.Router();

const { register, login, refresh, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authMiddleware, logout); // logout ke liye valid access token chahiye
router.get("/get-me", authMiddleware, (req, res) => {
  const decoded = req.user || {};

  res.json({
    user: {
      id: decoded.userId || decoded.id,
      username: decoded.username,
    },
  });
});
module.exports = router;
