import dotenv from "dotenv";
dotenv.config();
import app from './src/app.js'
import { conectToDB } from "./src/config/database.js";
conectToDB();
app.listen(3000, (req, res)=>{
    console.log('server is running on port 3000');
    
})