import React from "react";
import { usePost } from "../hook/usePost.js";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import { Link } from "react-router";
import Post from "../../post/components/Post.jsx";
import Nav from "../../shared/components/Nav.jsx";
import "../style/Reels.scss";

const ReelsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading } = usePost();

  if (authLoading) return <div>Checking authentication...</div>;
  if (!isAuthenticated) {
    return (
      <div>
        <p>You need to log in to view reels.</p>
        <Link to="/login">Go to login</Link>
      </div>
    );
  }

  if (postsLoading) return <div>Loading reels...</div>;
  if (!posts || posts.length === 0) return <div>No reels available.</div>;

  return (
    <>
      <div className="reels-feed">
        {posts.map((post) => (
          <Post key={post._id || post.id} post={post} />
        ))}
      </div>
      <Nav />
    </>
  );
};

export default ReelsPage;