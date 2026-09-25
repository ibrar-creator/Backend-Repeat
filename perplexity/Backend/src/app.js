import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// ========================
// Middlewares
// ========================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// ========================
// Health Check
// ========================

app.get("/", (req, res) => {
  res.json({
    message: "Perplexity Clone API is running 🚀",
  });
});

// ========================
// Routes
// ========================

app.use("/api/auth", authRoutes);

// ========================
// Error Middleware
// ========================

app.use(errorMiddleware);

export default app;
