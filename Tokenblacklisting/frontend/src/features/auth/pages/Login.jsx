import { useState } from "react";
import { loginUser } from "../authService";
import { Link, useNavigate } from "react-router-dom";
import "../style/login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        username,
        password,
      });

      console.log("Login:", data);

      alert("Login successful");

      // Login ke baad Home
      navigate("/", { replace: true });

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        "Login failed"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <div className="input-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

          <p className="register-link">
            Don't have an account?{" "}
            <Link to="/register">
              Register here
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;