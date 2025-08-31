// AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { username, password });
      const token = res.data.token;
      localStorage.setItem("adminToken", token);

      // ✅ Fetch current admin info
      const adminRes = await axios.get("http://localhost:5000/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem("adminData", JSON.stringify(adminRes.data));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔐 Admin Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;
