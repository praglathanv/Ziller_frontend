import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SessionPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveTickets = async () => {
      try {
        const token = localStorage.getItem("adminToken"); // admin auth
        const res = await axios.get("https://ziller-backend.onrender.com/api/tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Only tickets with active:true
        const activeTickets = res.data.filter(ticket => ticket.active);
        setTickets(activeTickets);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        alert("Failed to load active tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🟢 Active Session</h2>
      <p>Started: {localStorage.getItem("sessionStartedAt")}</p>

      <h3>Tickets in this session</h3>
      {tickets.length === 0 ? (
        <p>No active tickets yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tickets.map((t, idx) => (
            <li
              key={t._id || idx}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9"
              }}
            >
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
        onClick={() => {
          localStorage.removeItem("isSessionActive");
          localStorage.removeItem("sessionStartedAt");
          navigate("/admin/dashboard");
        }}
      >
        End Session
      </button>
    </div>
  );
}

export default SessionPage;
