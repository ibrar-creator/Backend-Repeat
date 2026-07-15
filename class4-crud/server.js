import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectToDB } from "./src/config/database.js";
import app from "./src/app.js";


connectToDB();
app.listen(3000, ()=>{
    console.log("server is running on port 3000")
    
})