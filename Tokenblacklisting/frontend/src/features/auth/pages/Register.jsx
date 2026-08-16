import { useState } from "react";
import { registerUser } from "../authService";
import "../style/register.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser({
        username,
        email,
        password,
      });
     navigate("/", { replace: true });
      console.log("Register:", data);

      alert("Registration successful");

      // Registration ke baad login page
   

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <h1>Create Account</h1>
          <p>Register to get started</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="register-form"
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
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
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
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="register-btn"
          >
            Register
          </button>

          <p className="login-link">
            Already have an account?{" "}
            <Link to="/login">
              Login here
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;