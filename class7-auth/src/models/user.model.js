import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email:{
  type: String,
  unique: [true, "With this email user account already exists"]
    },
    password: String,

})

export const userModel = mongoose.model("users", userSchema)