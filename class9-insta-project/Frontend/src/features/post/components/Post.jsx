import React from "react";

const Post = ({ post }) => {
  const author = post?.user || {};
  return (
    <article className="insta-post">
      {/* Header */}
      <header className="post-header">
        <div className="user-info">
          <div className="avatar-story-ring">
            <img
              src={author.profileImage || "https://picsum.photos/id/64/150/150"}
              alt="User avatar"
              className="avatar"
            />
          </div>
          <div className="user-details">
            <div className="user-name-wrapper">
              <span className="username">
                {author.username || "alex_explorer"}
              </span>
            </div>
            <span className="location">{post?.location || "Kyoto, Japan"}</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="follow-btn">Follow</button>
          <button className="more-btn" aria-label="More options">
            <svg
              aria-label="More options"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="6" cy="12" r="1.5"></circle>
              <circle cx="18" cy="12" r="1.5"></circle>
            </svg>
          </button>
        </div>
      </header>

      {/* Media */}
      <div className="post-media">
        <img
          src={post?.imgUrl || "https://picsum.photos/id/1015/600/600"}
          alt={post?.caption || "Post content"}
        />
      </div>

      {/* Footer */}
      <footer className="post-footer">
        <div className="post-actions">
          <div className="left-actions">
            <button className="action-btn like-btn" aria-label="Like">
              <svg
               className={post.isLiked ? "like" : ""}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                height="24"
                width="24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            <button className="action-btn" aria-label="Comment">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                height="24"
                width="24"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>

            <button className="action-btn" aria-label="Share">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                height="24"
                width="24"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

            <button
              className="action-btn whatsapp-btn"
              aria-label="Share to WhatsApp"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                height="24"
                width="24"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                <path d="M16 14c-.5 0-1.5-.2-2-.7l-1.2-1.2c-.3-.3-.8-.3-1.1 0l-.7.7c-.3.3-.8.3-1.1 0l-1.5-1.5c-.3-.3-.3-.8 0-1.1l.7-.7c.3-.3.3-.8 0-1.1L8 7.2c-.5-.5-.7-1.5-.7-2"></path>
              </svg>
            </button>
          </div>

          <button className="action-btn save-btn" aria-label="Save">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              height="24"
              width="24"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>

        <div className="post-likes">
          <span>
            Liked by <strong>{post?.likedBy || "design_hub"}</strong> and{" "}
            <strong>{post?.likesCount || "1,420"} others</strong>
          </span>
        </div>

        <div className="post-caption">
          <span className="username">{author.username || "alex_explorer"}</span>{" "}
          <span className="text">
            {post?.caption ||
              "Lost in the beauty of ancient temples and peaceful gardens ⛩️✨"}
          </span>{" "}
          <span className="hashtag">
            {post?.hashtags || "#japan #travel #kyoto"}
          </span>
        </div>

        <a href="#comments" className="view-comments">
          View all {post?.commentsCount || "84"} comments
        </a>
        <time className="post-time" dateTime="2026-08-04">
          {post?.timeAgo || "2 HOURS AGO"}
        </time>
      </footer>
    </article>
  );
};

export default Post;
