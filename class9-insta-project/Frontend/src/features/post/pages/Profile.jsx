import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import Nav from "../../shared/components/Nav.jsx";
import "../style/Profile.scss";

const TABS = [
  { key: "posts", label: "Posts" },
  { key: "saved", label: "Saved" },
  { key: "tagged", label: "Tagged" },
];

const Profile = () => {
  const { username: routeUsername } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile =
    !routeUsername || routeUsername === currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const target = routeUsername || currentUser?.username;
        const res = await axios.get(
          `http://localhost:3000/api/users/${target}`,
          { withCredentials: true },
        );
        setProfile(res.data.user);
        setIsFollowing(res.data.isFollowing || false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [routeUsername, currentUser]);

  useEffect(() => {
    if (!profile) return;

    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/posts/${activeTab}/${profile._id || profile.id}`,
          { withCredentials: true },
        );
        setPosts(res.data.posts || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [profile, activeTab]);

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing
        ? `http://localhost:3000/api/users/unfollow/${profile._id || profile.id}`
        : `http://localhost:3000/api/users/follow/${profile._id || profile.id}`;
      const res = await axios.post(endpoint, {}, { withCredentials: true });
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found.</div>;

  return (
    <>
      <div className="profile-page">
        <header className="profile-header">
          <img
            className="profile-avatar"
            src={profile.profileImage || "https://picsum.photos/id/64/200/200"}
            alt={profile.username}
          />

          <div className="profile-details">
            <div className="profile-top-row">
              <h2>{profile.username}</h2>

              {isOwnProfile ? (
                <button className="edit-profile-btn">Edit profile</button>
              ) : (
                <button
                  className={`follow-btn${isFollowing ? " following" : ""}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <div className="profile-stats">
              <span>
                <strong>{profile.postsCount ?? posts.length}</strong> posts
              </span>
              <span>
                <strong>{profile.followersCount ?? 0}</strong> followers
              </span>
              <span>
                <strong>{profile.followingCount ?? 0}</strong> following
              </span>
            </div>

            <div className="profile-bio">
              <h4>{profile.fullName || profile.username}</h4>
              <p>{profile.bio || "No bio yet."}</p>
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer">
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </header>

        <nav className="profile-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="profile-grid">
          {posts.length === 0 ? (
            <p className="status-text">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id || post.id} className="grid-tile">
                <img
                  src={post.imgUrl || "https://picsum.photos/id/1015/400/400"}
                  alt="post"
                />
                <div className="grid-tile-overlay">
                  <span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {post.likesCount ?? 0}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
                    </svg>
                    {post.commentsCount ?? 0}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Profile;