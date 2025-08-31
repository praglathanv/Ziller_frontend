// AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
      return;
    }

    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(res.data);
      } catch (err) {
        console.error(err);
        navigate("/admin");
      }
    };

    fetchAdmin();
  }, [navigate]);

  if (!admin) return <p>Loading dashboard...</p>;

  // ✅ Function to create session
  const handleCreateSession = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:5000/api/admin/${admin._id}/session`,
        { currentSession: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/create-session"); // redirect to the session page
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create session");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛠️ Admin Dashboard</h2>
      <p>
        Logged in as <strong>{admin.username}</strong> (ID: {admin._id})
      </p>

      {/* Button to Add Admin */}
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
          marginRight: "10px"
        }}
        onClick={() => navigate("/add-admin")}
      >
        ➕ Add Admin
      </button>

      {/* Button to Ticket History */}
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
          marginRight: "10px"
        }}
        onClick={() => navigate("/bus-collection")}
      >
        🎟️ Ticket History
      </button>

      {/* Conditional Session Button */}
      {admin.currentSession ? (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
          onClick={() => navigate("/create-session")}
        >
          👀 View Session
        </button>
      ) : (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
          onClick={handleCreateSession}
        >
          🟢 Create Session
        </button>
      )}
    </div>
  );
}

export default AdminDashboard;
