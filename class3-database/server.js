import mongoose from "mongoose";
import app from "./src/app.js";


function connectToDB(){
   mongoose.connect("")
   .then(()=>{
    console.log("mongodb connect");
    
   })
}
connectToDB()
app.listen(3000, ()=>{
    console.log("server is running on port 3000");
    
})