// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData
    );

    // ✅ Extract token and user info from response
    const { token, user } = res.data;

    // ✅ Store token and current user in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Login successful!");
    
    // ✅ Redirect to homepage
    navigate("/");

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
 };


  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🔑 Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px" }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px", borderRadius: "5px", background: "#28a745", color: "#fff" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Don't have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/signup")}>Signup</span>
      </p>
    </div>
  );
}

export default Login;
