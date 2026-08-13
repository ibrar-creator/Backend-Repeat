import React from "react";
import { Link, useLocation } from "react-router";
import "../../post/style/Nav.scss";

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
      </svg>
    ),
  },
  {
    label: "Search",
    to: "/search",
    icon: () => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: "Reels",
    to: "/reels",
    icon: () => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="4" />
        <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Messages",
    to: "/messages",
    icon: () => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5z" />
      </svg>
    ),
  },
  {
    label: "Create",
    to: "/create",
    icon: () => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: "Profile",
    to: "/profile",
    icon: () => (
      <img
        className="nav-avatar"
        src="https://picsum.photos/id/64/60/60"
        alt="Profile"
      />
    ),
  },
];

const Nav = () => {
  const location = useLocation();

  return (
    <nav className="insta-nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c1.5 0 1.68.006 2.27.033.98.045 1.5.207 1.86.344.47.18.8.396 1.15.745.35.35.566.68.745 1.15.137.36.3.88.344 1.86.027.59.033.77.033 2.27s-.006 1.68-.033 2.27c-.045.98-.207 1.5-.344 1.86a3.1 3.1 0 0 1-.745 1.15 3.1 3.1 0 0 1-1.15.745c-.36.137-.88.3-1.86.344-.59.027-.77.033-2.27.033s-1.68-.006-2.27-.033c-.98-.045-1.5-.207-1.86-.344a3.1 3.1 0 0 1-1.15-.745 3.1 3.1 0 0 1-.745-1.15c-.137-.36-.3-.88-.344-1.86C6.006 13.68 6 13.5 6 12s.006-1.68.033-2.27c.045-.98.207-1.5.344-1.86.18-.47.396-.8.745-1.15.35-.35.68-.566 1.15-.745.36-.137.88-.3 1.86-.344C10.32 6.006 10.5 6 12 6z" />
          </svg>
          <span>Instagram</span>
        </Link>

        <ul className="nav-list">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={`nav-link${active ? " active" : ""}`}
                >
                  {item.icon(active)}
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;