import express from "express";
import { noteModel } from "./models/notes.model.js";
const app = express();
app.use(express.json());
app.post("/notes", async(req, res)=>{
   const {title, description} = req.body;
  
   const note = await noteModel.create({
        title, description
    })
    res.status(201).json({
        message: "Note created successfully",
        note
    })
})
app.get("/notes", async(req, res)=>{
    const notes = await noteModel.find()
        res.status(200).json({
            message: "Note fetched successfully",
            notes
        })
    
})
export default app