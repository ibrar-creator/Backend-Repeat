import express from "express";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto'
export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });
  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already axists with this email",
    });
  }
  const hash = crypto.createHash("md5").update(password).digest("hex")
  const user = await userModel.create({
    name,
    email,
    password:hash,
  });
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token);
  res.status(201).json({
    message: "User Registered",
    user,
    token,
  });
});

authRouter.post("/login", async(req, res)=>{
    const {email, password} = req.body


    const user = await userModel.findOne({email})

    if(!user) {
        return res.status(404).json({
            message: "user not found with this email adress"
        })
    }
    const  isPasswordMatched = user.password === password

    if(!isPasswordMatched){
        return res.status(401).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign({
        id: user._id,

    }, process.env.JWT_SECRET)
    res.cookie("jwt_token", token)

    res.status(200).json({
        message: "user logged in",
        user
    })
})
