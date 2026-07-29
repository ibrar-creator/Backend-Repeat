import mongoose from "mongoose";

export function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connect to db");
        
    })
}