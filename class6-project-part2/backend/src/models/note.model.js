import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  priority: String,
  tags: String,
  date: String
});

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;