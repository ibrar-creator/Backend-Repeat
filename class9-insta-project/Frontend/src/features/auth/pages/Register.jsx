import React from "react";
import "../style/Register.scss";
import { Link } from "react-router";
import axios from "axios";
import { useState } from "react";
import { register } from "../services/auth.api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router";

const Register = () => {
  const footerLinks = [
    "About",
    "Help",
    "Press",
    "API",
    "Jobs",
    "Privacy",
    "Terms",
    "Locations",
    "Language",
  ];
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleRegister, loading } = useAuth();
  const [language, setLanguage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister(username, email, password);
    navigate("/");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="instagram-login-container">
      <div className="main-content">
        {/* Left Hero Section */}
        <div className="left">
          <img
            className="insta-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt=""
          />

          <h1>
            See everyday moments from <br />
            your <span>close friends.</span>
          </h1>

          {/* IMAGE STACK */}
          <div className="card-stack">
            <img src="/insta.png" alt="" />
          </div>
        </div>

        {/* Right Form Section */}
        <div className="login-section">
          <div className="login-box">
            <h2 className="form-title">Log into Instagram</h2>

            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-field"
                placeholder="Mobile number, username or email"
                onInput={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                onInput={(e) => setEmail(e.target.value)}
                required
              />
              <input
                onInput={(e) => {
                  setPassword(e.target.value);
                }}
                className="input-field"
                type="password"
                name="password"
                placeholder="Password"
              />
              <button className="btn-login " type="submit">
                Register
              </button>
            </form>

            <p className="extra">
              Already have an account? <Link to={"/login"}>Login</Link>
            </p>

            <button className="btn-fb-login">
              <svg className="fb-icon" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Log in with Facebook
            </button>

            <button className="btn-create-account">Create new account</button>

            <div className="meta-brand">
              <svg className="meta-icon" viewBox="0 0 24 24">
                <path d="M16.481 4.5c-2.122 0-3.834 1.134-5.011 2.812C10.293 5.634 8.58 4.5 6.459 4.5 2.892 4.5 0 7.42 0 11.025c0 4.195 3.931 7.822 9.539 12.5a.75.75 0 0 0 .981 0c5.608-4.678 9.539-8.305 9.539-12.500C20.059 7.42 17.168 4.5 16.481 4.5z" />
              </svg>
              Meta
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="page-footer">
        <div className="footer-links">
          {footerLinks.map((link, idx) => (
            <a key={idx} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}>
              {link}
            </a>
          ))}
        </div>

        <div className="footer-bottom">
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Español">Español</option>
            <option value="Français">Français</option>
            <option value="Deutsch">Deutsch</option>
            <option value="Urdu">اردو</option>
          </select>
          <span>© 2026 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
};

export default Register;