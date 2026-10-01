import React, { useEffect, useState } from "react";
import "./About.css";
import Sidebar from "./Sidebar";
import axios from "axios";
import Login from "../login/LoginPage";
import defaultLogo from "../assets/logo.png"; // <-- your default logo

const About = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    profileImgUrl: "", // must match backend
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  // ---------------- Fetch user profile ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/user/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.data; // backend returns UserResponse
        setUserData({
          name: data.name || "",
          email: data.email || "",
          password: "",
          profileImgUrl: data.profileImgUrl || "", // may be empty
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) fetchProfile();
  }, [token, userId]);

  // ---------------- Handle input change ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Handle form submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await axios.put(
        `${API_URL}/user/update/${userId}`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedData = res.data.data || userData;
      setUserData((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        email: updatedData.email || prev.email,
        profileImgUrl: updatedData.profileImgUrl || prev.profileImgUrl,
      }));

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- Handle logout ----------------
  const handleLogout = () => {
    localStorage.clear();
    setLoggedOut(true);
  };

  if (loading) return <p>Loading...</p>;
  if (loggedOut) return <Login />;

  return (
    <div className="about-dashboard">
      <Sidebar />

      <main className="about-content">
        <div className="profile-section">
          {/* Circular profile image with fallback to default logo */}
          <img
            src={userData.profileImgUrl ? userData.profileImgUrl : defaultLogo}
            alt="Profile"
            className="profile-logo"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "20px",
              border: "3px solid #c47233",
            }}
          />

          <form className="profile-form" onSubmit={handleSubmit}>
            <label>Profile Image URL</label>
            <input
              type="text"
              name="profileImgUrl"
              placeholder="Enter image URL"
              value={userData.profileImgUrl}
              onChange={handleChange}
            />

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
                onClick={() => window.history.back()}
              >
                Back
              </button>
              <button type="submit" className="update-btn" disabled={saving}>
                {saving ? "Updating..." : "Update"}
              </button>
            </div>

            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default About;
