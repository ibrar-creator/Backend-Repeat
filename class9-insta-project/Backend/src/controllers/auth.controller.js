import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function registerController(req, res) {
  const { username, email, password, bio, profileImage } = req.body;

  //   const isUserExistsByEmail = await userModel.findOne({ email });

  //   if (isUserExistsByEmail) {
  //     return res.status(409).json({
  //       message: "User already exists with this email",
  //     });
  //   }

  //   const isUserExistsByEmail = await userModel.findOne({ username });

  //   if (isUserExistsByUsername) {
  //     return res.status(409).json({
  //       message: "User already exists by Username",
  //     });
  //   }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
    bio,
    profileImage,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      username: newUser.username,
      email: newUser.email,
      bio: newUser.bio,
      profileImage: newUser.profileImage,
    },
  });
}

export async function loginController(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [
      {
        username: username,
      },
      {
        email: email,
      },
    ],
  });

  if (!user) {
    return res.status(409).json({
      message: "User not found",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token);

  res.status(200).json({
    message: "Login successful",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}
