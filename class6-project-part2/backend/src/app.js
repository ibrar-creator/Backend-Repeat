import express from "express";
import noteModel from "./models/note.model.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(cors());


// React build files serve
app.use(
  express.static(
    path.join(__dirname, "..", "public")
  )
);


// Create Note
app.post("/api/notes", async (req, res) => {
  try {

    const {
      title,
      description,
      category,
      priority,
      tags,
      date
    } = req.body;


    const note = await noteModel.create({
      title,
      description,
      category,
      priority,
      tags,
      date,
    });


    res.status(201).json({
      message: "note created successfully",
      note,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});



// Get Notes
app.get("/api/notes", async (req, res) => {
  try {

    const notes = await noteModel.find();


    res.status(200).json({
      message: "notes fetched successfully",
      notes,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});



// Delete Note
app.delete("/api/notes/:id", async (req, res) => {
  try {

    await noteModel.findByIdAndDelete(req.params.id);


    res.status(200).json({
      message: "note deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});



// Update Note
app.patch("/api/notes/:id", async (req, res) => {
  try {

    const updatedNote = await noteModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );


    res.status(200).json({
      message: "note updated successfully",
      note: updatedNote,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});



// Frontend fallback route (LAST)
app.get("/{*any}", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "..",
      "public",
      "index.html"
    )
  );

});


export default app;