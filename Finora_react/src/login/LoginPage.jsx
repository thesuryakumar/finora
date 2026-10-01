import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginPage.css"
import logo from "../assets/logo.png"
import axios from "axios"

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("") // For inline error/success messages

  // Use the .env variable here
  const API_URL = import.meta.env.VITE_API_URL



  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("") // reset previous message

    try {
      const response = await axios.post(
        `${API_URL}/user/signin`, // mapped from .env
        { email, password },
        { withCredentials: true } // allow cookies/session if needed
      )

      // Store JWT token
      const token = response.data.token
      localStorage.setItem("userId", response.data.userId)
      localStorage.setItem("token", token)

      // Set default Authorization header for all axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setMessage("Login successful!") // optional: show success message
      navigate("/dashboard")
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Login failed")
      } else {
        setMessage("Login failed: Network error")
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Logo" className="logo" />

        <h2>Login</h2>

        {message && <div className="message">{message}</div>} {/* show message here */}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">Log In</button>
        </form>
        <p>
          Don’t have an account?{" "}
          <Link to="/register" className="link">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
