// PostFeed.jsx
import { usePost } from "../hook/usePost.js";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import { Link } from "react-router";
import Post from "../components/Post.jsx";
import "../style/Feed.scss";

const Feed = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading } = usePost(isAuthenticated);

  if (authLoading) return <div>Checking authentication...</div>;
  if (!isAuthenticated) {
    return (
      <div>
        <p>You need to log in to view the feed.</p>
        <Link to="/login">Go to login</Link>
      </div>
    );
  }

  if (postsLoading) return <div>Loading posts...</div>;
  if (!posts || posts.length === 0) return <div>No posts available.</div>;

  return (
    <div className="feed-list">
      {posts.map((post) => (
        <Post key={post._id || post.id} post={post} />
      ))}
    </div>
  );
};
export default Feed;
