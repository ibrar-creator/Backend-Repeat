import express from "express";
import {
  registerController,
  loginController,
  getMeController,
} from "../controllers/auth.controller.js";
import identifyuser from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/get-me", identifyuser, getMeController);
export default authRouter;
