import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SessionPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionTickets = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        // ✅ Get logged-in admin info
        const adminRes = await axios.get("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(adminRes.data);

        // ✅ Fetch all tickets
        const ticketsRes = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("All tickets:", ticketsRes.data);

        // ✅ Only active tickets for this admin (use busName not busId)
        const activeTickets = ticketsRes.data.filter(
          (t) =>
            t.active &&
            (t.busName === adminRes.data.username ||
             t.busName === adminRes.data.busName)
        );

        console.log("Active tickets for this session:", activeTickets);

        setTickets(activeTickets);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        alert("Failed to load active tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionTickets();
  }, []);

  const handleEndSession = async () => {
  if (!admin) {
    console.error("❌ Admin is null, cannot close session.");
    return;
  }

  const token = localStorage.getItem("adminToken");
  if (!token) {
    console.error("❌ No token found in localStorage.");
    return;
  }

  console.log("🔑 Using token:", token);
  console.log("👤 Admin ID for close-session:", admin._id);

  try {
    const res = await axios.post(
      `http://localhost:5000/api/admin/${admin._id}/close-session`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("✅ Backend response:", res.data);

    alert("Session closed! All active tickets have been deactivated.");
    setTickets([]); // Clear the ticket list on frontend
    navigate("/admin/dashboard");
  } catch (err) {
    console.error("❌ Failed to close session:", err.response?.data || err.message);
    alert("Failed to close session");
  }
};


  if (loading) return <p>Loading tickets...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🟢 Active Session</h2>
      <p>Started: {localStorage.getItem("sessionStartedAt")}</p>

      <h3>Tickets in this session</h3>
      {tickets.length === 0 ? (
        <p>No active tickets for this session</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tickets.map((t) => (
            <li
              key={t._id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <p><strong>Username:</strong> {t.userName}</p>
              <p><strong>Bus:</strong> {t.busName}</p>
              <p><strong>Fare:</strong> ₹{t.amount}</p>
              <p><strong>Date:</strong> {t.date ? new Date(t.date).toLocaleString() : "N/A"}</p>
              {t.start && t.destination && (
                <>
                  <p><strong>From:</strong> {t.start.lat}, {t.start.lng}</p>
                  <p><strong>To:</strong> {t.destination.lat}, {t.destination.lng}</p>
                  <p><strong>Distance:</strong> {t.distance} km</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "20px"
        }}
        onClick={handleEndSession}
      >
        End Session
      </button>
    </div>
  );
}

export default SessionPage;
