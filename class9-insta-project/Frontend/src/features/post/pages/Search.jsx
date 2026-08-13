import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import Nav from "../../shared/components/Nav.jsx";
import "../style/Search.scss";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load explore grid on mount
  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/posts/explore", {
          withCredentials: true,
        });
        setExplorePosts(res.data.posts || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExplore();
  }, []);

  // Debounced user search
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/search", {
          params: { q: query },
          withCredentials: true,
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const showResults = query.trim().length > 0;

  return (
    <>
      <div className="search-page">
        <div className="search-header">
          <h2>Search</h2>
          <div className="search-input-wrapper">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="clear-btn" onClick={() => setQuery("")}>
                ✕
              </button>
            )}
          </div>
        </div>

        {showResults ? (
          <div className="search-results">
            {loading && <p className="status-text">Searching...</p>}
            {!loading && users.length === 0 && (
              <p className="status-text">No results found.</p>
            )}
            {users.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                key={user._id || user.id}
                className="user-result"
              >
                <img
                  src={user.profileImage || "https://picsum.photos/id/64/80/80"}
                  alt={user.username}
                  className="user-avatar"
                />
                <div className="user-meta">
                  <h4>{user.username}</h4>
                  <p>{user.fullName || user.name || "Instagram user"}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="explore-grid">
            {explorePosts.length === 0 ? (
              <p className="status-text">No posts to explore yet.</p>
            ) : (
              explorePosts.map((post, idx) => {
                const isFeatured = idx % 7 === 0; // occasional larger tile like real Explore
                return (
                  <Link
                    to={`/post/${post._id || post.id}`}
                    key={post._id || post.id}
                    className={`explore-tile${isFeatured ? " featured" : ""}`}
                  >
                    <img
                      src={post.imgUrl || "https://picsum.photos/id/1015/400/400"}
                      alt="post"
                    />
                    {post.isReel && (
                      <span className="reel-badge">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                          <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
                        </svg>
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
      <Nav />
    </>
  );
};

export default Search;