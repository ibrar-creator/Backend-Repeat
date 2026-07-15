// const express = require('express');

// const app = express();
// app.use(express.json());
// const notes= [];
// app.get("/notes", (req, res)=>{
//     res.send(notes)
// })
// app.post("/notes",(req, res)=>{
//     console.log(req.body);
//     notes.push(req.body)
//     res.send("note created");
//     console.log(notes);
    
// })
// app.delete("/notes/:index", (req, res) =>{
// delete notes[req.params.index];
// res.send("note delete successfully")

// })
// app.patch("/notes/:index", (req, res) =>{
// notes[req.params.index].description = req.body.description
// notes[req.params.index].title = req.body.title
// res.send("note updated successfully")

// })
// module.exports = app

const express = require("express");


const app = express()
const notes = []
app.use(express.json());

app.get("/notes", (req, res)=>{
    res.send(notes)
})
app.post("/notes", (req, res)=>{
    res.send("note created successfully")
    notes.push(req.body)
})

app.patch("/notes/:index", (req, res)=>{
    notes[req.params.index].title = req.body.title
    notes[req.params.index].description= req.body.description
    res.send("note updated successfully")
})
app.delete("/notes/:index", (req, res)=>{
    delete notes[req.params.index]
    res.send("note deleted successfully")
})
module.exports = app;