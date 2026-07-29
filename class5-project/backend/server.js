import dotenv from "dotenv";
dotenv.config();
import  {connectToDb}  from "./src/config/database.js";
import app from "./src/app.js"

connectToDb();
app.listen(3000, ()=>{
    console.log("server is running on port 3000");
    
})