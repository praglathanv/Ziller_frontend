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

        // ✅ Only tickets for this admin and active
        const activeTickets = ticketsRes.data.filter(
          (t) => t.active && t.busId === adminRes.data._id
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
  if (!admin) return;

  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    // Call backend to close session and deactivate tickets
    const res = await axios.post(
      `http://localhost:5000/api/admin/${admin._id}/close-session`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log(res.data.message, "Modified tickets:", res.data.modifiedCount);

    alert("Session closed! All active tickets have been deactivated.");
    setTickets([]); // Clear the ticket list on frontend
    navigate("/admin/dashboard");
  } catch (err) {
    console.error("Failed to close session:", err);
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
    onClick={handleEndSession} // ✅ call the API now
    >
    End Session
    </button>

    </div>
  );
}

export default SessionPage;
