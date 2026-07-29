import express, { Router } from "express";
import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const authRouter = Router();


authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const isEmailAlreadyExists = await userModel.findOne({ email });
  if (isEmailAlreadyExists) {
    res.status(409).json({
      message: "this email already axists",
    });
  }

  const user = await userModel.create({
    name,
    email,
    password: crypto.createHash("sha256").update(password).digest("hex"),
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const isPassordValid = hash === user.password;

  if (!isPassordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  res.cookie("token", token);

  res.json({
    message: "User logged in successfully",
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

authRouter.get("/get-me", async (req, res) => {
  const token = req.cookies.token;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decoded.id);

  res.json({
    name: user.name,
    email: user.email,
  });
});
export default authRouter;
