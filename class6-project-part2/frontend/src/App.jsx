import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);
      setNotes(res.data.notes);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNotes();
  }, []);


  // Create Note
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const noteData = {
      title: form.title.value,
      description: form.description.value,
      category: form.category.value,
      priority: form.priority.value,
      tags: form.tags.value,
      date: form.date.value,
    };


    try {
      await axios.post(API_URL, noteData);

      fetchNotes();

      form.reset();

    } catch (error) {
      console.log(error);
    }
  };


  // Delete Note
  const handleDeleteNote = async (id) => {
    try {

      await axios.delete(`${API_URL}/${id}`);

      fetchNotes();

    } catch (error) {
      console.log(error);
    }
  };


  // Update Note
  const handleUpdateNote = async (note) => {

    const title = prompt("Enter title", note.title);
    const description = prompt(
      "Enter description",
      note.description
    );

    const category = prompt(
      "Enter category",
      note.category || ""
    );

    const priority = prompt(
      "Enter priority",
      note.priority || ""
    );

    const tags = prompt(
      "Enter tags",
      note.tags || ""
    );

    const date = prompt(
      "Enter date",
      note.date || ""
    );


    if (!title || !description) return;


    try {

      await axios.patch(
        `${API_URL}/${note._id}`,
        {
          title,
          description,
          category,
          priority,
          tags,
          date,
        }
      );


      fetchNotes();


    } catch (error) {
      console.log(error);
    }

  };


  return (

    <div className="container">


      {/* Create Note */}

      <div className="left">

        <h1>Create New Note</h1>


        <form
          className="note-create-form"
          onSubmit={handleSubmit}
        >


          <input
            name="title"
            type="text"
            placeholder="Note Title"
            required
          />


          <textarea
            name="description"
            rows="7"
            placeholder="Write your note..."
            required
          />


          <input
            name="category"
            type="text"
            placeholder="Category"
          />


          <select name="priority">

            <option value="">
              Select Priority
            </option>

            <option value="High">
              🔴 High
            </option>

            <option value="Medium">
              🟡 Medium
            </option>

            <option value="Low">
              🟢 Low
            </option>

          </select>


          <input
            name="tags"
            type="text"
            placeholder="Tags"
          />


          <input
            name="date"
            type="date"
          />


          <button>
            Create Note
          </button>


        </form>

      </div>



      {/* Notes List */}


      <div className="right">

        <h1>
          All Notes
        </h1>


        {
          loading ? (
            <h2>Loading...</h2>
          ) : (


          <div className="notes">


          {
            notes.map((note)=>(


              <div
                className="note"
                key={note._id}
              >


                <h2>
                  {note.title}
                </h2>


                <p>
                  {note.description}
                </p>



                <div className="note-info">

                  <span>
                    📂 {note.category || "No Category"}
                  </span>


                  <span>
                    ⚡ {note.priority || "Normal"}
                  </span>


                  <span>
                    🏷️ {note.tags || "No Tags"}
                  </span>


                  <span>
                    📅 {note.date || "No Date"}
                  </span>


                </div>



                <div className="btns">


                  <button
                    className="update-btn"
                    onClick={() =>
                      handleUpdateNote(note)
                    }
                  >
                    Update
                  </button>



                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteNote(note._id)
                    }
                  >
                    Delete
                  </button>


                </div>


              </div>


            ))
          }


          </div>

          )

        }


      </div>


    </div>

  );

};


export default App;