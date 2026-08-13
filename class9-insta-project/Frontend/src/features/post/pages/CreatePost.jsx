import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../style/CreatePost.scss";
import Nav from "../../shared/components/Nav.jsx";
import { usePost } from "../hook/usePost";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { handleCreatePost } = usePost();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("location", location);
      formData.append("image", image);

      await handleCreatePost(formData);
      navigate("/");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <div className="create-post-card">
          <div className="card-header">
            <h2>Create New Post</h2>
            <button
              className="share-btn"
              onClick={handleSubmit}
              disabled={loading || !image}
            >
              {loading ? "Posting..." : "Share"}
            </button>
          </div>

          <div className="card-body">
            <div className="media-upload-area">
              {preview ? (
                <div className="image-preview-wrapper">
                  <img src={preview} alt="Post preview" />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label htmlFor="file-input" className="upload-placeholder">
                  <span>Select photo from device</span>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="post-details-area">
              <textarea
                className="caption-input"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <input
                type="text"
                className="location-input"
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default CreatePost;