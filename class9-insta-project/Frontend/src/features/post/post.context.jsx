import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/auth.context.jsx";
import { getFeed, createPost } from "./services/post.api.js";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const feedPosts = await getFeed();
      setPosts(feedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (formData) => {
    setLoading(true);
    try {
      const newPost = await createPost(formData);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <PostContext.Provider
      value={{ posts, loading, handleCreatePost, fetchPosts }}
    >
      {children}
    </PostContext.Provider>
  );
};
