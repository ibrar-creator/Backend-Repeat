import { useState } from "react";
import api from "./api";

function Login({ onLogin, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      onLogin(response.data.user);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-card">
      <div className="auth-brand">
        <span className="brand-mark">W</span>
        <strong>whisper</strong>
      </div>
      <p className="eyebrow">Welcome back</p>
      <h1>Good to see you.</h1>
      <p className="auth-intro">
        Your conversations are waiting in a quieter corner of the internet.
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="auth-error">{errorMessage}</p>}
        <button className="primary-button" type="submit">
          Enter whisper
        </button>
      </form>
      <p className="auth-switch">
        New here?{" "}
        <button className="link-button" type="button" onClick={onRegisterClick}>
          Create an account
        </button>
      </p>
    </section>
  );
}

export default Login;
