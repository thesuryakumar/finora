import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginPage.css"
import logo from "../assets/logo.png"
import axios from "axios"

const RegisterPage = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileImgUrl, setProfileImgUrl] = useState("") // New field
  const [profileImgUrlPublicId, setProfileImgUrlPublicId] = useState("") // New field
  const [message, setMessage] = useState("") // For error/success messages

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage("") // Reset message on new attempt

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!")
      return
    }

    try {
      const response = await axios.post(
         `${API_URL}/user/signup`,
        { name, email, password, profileImgUrl, profileImgUrlPublicId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      // Store JWT token in localStorage for future requests
      localStorage.setItem("token", response.data.token)

      setMessage("Registration successful!")
      navigate("/")
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Registration failed")
      } else {
        setMessage("Registration failed: Network error")
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Logo" className="logo" />

        <h2>Register</h2>
        {message && (
          <div className="message">
            {message}
          </div>
        )}
        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Profile Image URL"
            className="input"
            value={profileImgUrl}
            onChange={(e) => setProfileImgUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Profile Image Public ID"
            className="input"
            value={profileImgUrlPublicId}
            onChange={(e) => setProfileImgUrlPublicId(e.target.value)}
          />
          <button type="submit" className="button">Register</button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/" className="link">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
