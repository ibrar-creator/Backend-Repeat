import mongoose from "mongoose"


const newSchema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        unique: [true, "Email already axists"]
    },
    password: String
})

const userModel = mongoose.model("Users", newSchema)
export default userModel