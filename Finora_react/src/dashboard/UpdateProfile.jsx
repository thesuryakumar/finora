import React, { useState } from "react";
import "./About.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom"; // assuming react-router

const UpdateProfile = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call for updating profile can be added here
    alert("Profile update submitted!");
  };

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="about-dashboard">
      <Sidebar />

      <main className="about-content">
        <div className="profile-section">
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={userData.name}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={userData.password}
              onChange={handleChange}
            />

            <div className="button-group">
              <button
                type="button"
                className="back-btn"
                onClick={handleBack}
              >
                Back
              </button>
              <button type="submit" className="update-btn">
                Update
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateProfile;
