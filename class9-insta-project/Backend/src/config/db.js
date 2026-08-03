import mongoose from "mongoose";

function connectDB() {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connect to DB");
  });
}
export default connectDB;
