// src/api.js
import axios from "axios";

const API_URL = "http://localhost:1234"; // Spring Boot server

// Get JWT token from localStorage after login
const token = localStorage.getItem("jwtToken");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
