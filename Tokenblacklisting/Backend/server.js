// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler")
const app = express();

// Enable CORS before any routes so preflight requests succeed
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());
connectDB();
// Auth ke saare routes: /api/auth/register, /login, /refresh, /logout
app.use("/api/auth", authRoutes);
// ------------------------------------------------------------------
// Example protected route — sirf valid access token waale dekh sakte hain
// ------------------------------------------------------------------
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Ye protected data hai",
    user: req.user,
  });
});
app.use(errorHandler)
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server chal raha hai: http://localhost:${process.env.PORT || 3000}`);
});