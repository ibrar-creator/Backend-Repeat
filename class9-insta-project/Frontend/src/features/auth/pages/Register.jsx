import React from 'react'
import "../style/form.scss"
import { Link } from 'react-router'
import axios from 'axios'
import { useState } from 'react'
import { register } from '../services/auth.api.js'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router'
const Register = () => {
 const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { handleRegister, loading } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
      await handleRegister(username, email, password)
      navigate("/")
    }
    if (loading) {
        return <div>Loading...</div>;
    }
  return (
     <main className="auth">
      <div className="form-container">
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>
          <input
           onInput={(e) => {setUsername(e.target.value)}}
           type="text" name='username' placeholder="Username" />
          <input
           onInput={(e) => {setEmail(e.target.value)}}
           type="email" name='email' placeholder="Email" />
          <input
           onInput={(e) => {setPassword(e.target.value)}}
           type="password" name='password' placeholder="Password" />
          <button type="submit">Register</button>
          <p className="extra">
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </form>
      </div>
    </main>
  )
}

export default Register