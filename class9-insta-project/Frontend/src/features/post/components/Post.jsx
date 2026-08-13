import React, { useState } from "react";
import axios from "axios";

const Post = ({ post }) => {
  const author = post?.user || {};

  // STATES
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isFollowing, setIsFollowing] = useState(post?.isFollowing || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);

  // LIKE
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/posts/like/${post._id}`,
        {},
        { withCredentials: true },
      );

      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.log(err);
    }
  };

  // FOLLOW
  const handleFollow = async () => {
    try {
      const endpoint = isFollowing
        ? `http://localhost:3000/api/users/unfollow/${author._id}`
        : `http://localhost:3000/api/users/follow/${author._id}`;

      const res = await axios.post(endpoint, {}, { withCredentials: true });

      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.log(err);
    }
  };

  // SAVE
  const handleSave = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/posts/save/${post._id}`,
        {},
        { withCredentials: true },
      );

      setIsSaved(!isSaved);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <article className="insta-post">
      {/* HEADER */}
      <header className="post-header">
        <div className="user-info">
          <div className="avatar-story-ring">
            <img
              src={author.profileImage || "https://picsum.photos/id/64/150/150"}
              alt="User avatar"
              className="avatar"
            />
          </div>

          <div>
            <h4>{author.username || "alex_explorer"}</h4>
            <p>{post?.location || "Kyoto, Japan"}</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="follow-btn" onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>

          <button className="more-btn">
            <svg height="24" width="24" fill="currentColor">
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="6" cy="12" r="1.5"></circle>
              <circle cx="18" cy="12" r="1.5"></circle>
            </svg>
          </button>
        </div>
      </header>

      {/* IMAGE */}
      <div className="post-media">
        <img
          src={post?.imgUrl || "https://picsum.photos/id/1015/600/600"}
          alt="post"
        />
      </div>

      {/* FOOTER */}
      <footer className="post-footer">
        <div className="post-actions">
          <div className="left-actions">
            {/* LIKE */}
            <button className="action-btn" onClick={handleLike}>
              <svg
                className={isLiked ? "like" : ""}
                fill={isLiked ? "red" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                height="24"
                width="24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            {/* COMMENT */}
            <button className="action-btn">
              <svg height="24" width="24" stroke="currentColor">
                <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z"></path>
              </svg>
            </button>

            {/* SHARE */}
            <button className="action-btn">
              <svg height="24" width="24" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

            {/* WHATSAPP */}
            <button className="action-btn">
              <svg height="24" width="24" stroke="currentColor">
                <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z"></path>
              </svg>
            </button>
          </div>

          {/* SAVE */}
          <button className="action-btn" onClick={handleSave}>
            <svg
              fill={isSaved ? "black" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>

        {/* LIKES */}
        <div className="post-likes">
          <span>
            Liked by <strong>{post?.likedBy || "design_hub"}</strong> and{" "}
            <strong>{likesCount} others</strong>
          </span>
        </div>

        {/* CAPTION */}
        <div className="post-caption">
          <span className="username">{author.username || "alex_explorer"}</span>{" "}
          <span>
            {post?.caption || "Lost in the beauty of ancient temples ⛩️✨"}
          </span>{" "}
          <span className="hashtag">{post?.hashtags || "#travel #japan"}</span>
        </div>

        {/* COMMENTS */}
        <a href="#comments" className="view-comments">
          View all {post?.commentsCount || 84} comments
        </a>

        {/* TIME */}
        <time>{post?.timeAgo || "2 HOURS AGO"}</time>
      </footer>
    </article>
  );
};

export default Post;
