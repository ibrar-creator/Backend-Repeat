import mongoose from "mongoose";


 export function conectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connect to Db");
        
    })
}