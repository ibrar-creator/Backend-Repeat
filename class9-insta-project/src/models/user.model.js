import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "User name already exists"],
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/bwpodcwx2/WhatsApp%20Image%202025-11-13%20at%202.29.51%20PM.jpeg",
  },
  followers: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: "users"
  }],
  following: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: "users"
  }]
});

const userModel = mongoose.model("User", userSchema, "Users");
export default userModel;
