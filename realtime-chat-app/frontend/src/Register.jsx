import { useState } from "react";
import api from "./api";

function Register({ onRegistered, onLoginClick }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await api.post("/api/auth/register", form);

      onRegistered();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-card">
      <div className="auth-brand">
        <span className="brand-mark">W</span>
        <strong>whisper</strong>
      </div>
      <p className="eyebrow">Make room for more</p>
      <h1>Start softly.</h1>
      <p className="auth-intro">
        Create your space for the people and messages that matter.
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="register-name">Your name</label>
          <input
            id="register-name"
            name="username"
            placeholder="Ali Khan"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            minLength="8"
            required
          />
        </div>
        {errorMessage && <p className="auth-error">{errorMessage}</p>}
        <button className="primary-button" type="submit">
          Create my space
        </button>
      </form>
      <p className="auth-switch">
        Already have an account?{" "}
        <button className="link-button" type="button" onClick={onLoginClick}>
          Sign in
        </button>
      </p>
    </section>
  );
}

export default Register;
