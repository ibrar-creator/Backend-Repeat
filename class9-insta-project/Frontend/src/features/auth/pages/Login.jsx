import React from 'react'
import "../style/form.scss"
import { Link} from 'react-router'
import { useState } from 'react'
import axios from 'axios'
import { login } from '../services/auth.api.js'
import { useAuth } from '../hooks/useAuth.jsx'
import {useNavigate}from 'react-router'
const Login = () => {
      const { user, loading} = useAuth()
  const { handleLogin } = useAuth();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
const navigate = useNavigate()
  if(loading) {
    return <div>Loading...</div>;
  }

  function handleSubmit(e){
    e.preventDefault()
    handleLogin(username, password)
    .then(res => {
      console.log(res);
      navigate("/")
    })
  }
  return (
<main className="login">
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
          onInput={(e) => {setUsername(e.target.value)}}
           type="text" placeholder="Username or Email" />
          <input
           onInput={(e) => {setPassword(e.target.value)}}
           type="password" placeholder="Password" />

          <button type="submit">Login</button>

          <p className="extra">
            Don't have an account? <Link to={"/register"}>Register</Link>
          </p>
        </form>
      </div>
    </main>
  )
}

export default Login