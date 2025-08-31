// src/Tickets.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT for auth
        const res = await axios.get("http://localhost:5000/api/tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        

        setTickets(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading tickets...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>🎟️ My Ticket History</h2>

      {tickets.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "16px" }}>No tickets found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tickets.map((t, idx) => (
            <li
              key={t._id || idx}
              style={{
                marginBottom: "15px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                backgroundColor: "#f9f9f9",
                position: "relative",
              }}
            >
              {/* Status badge */}
              <span
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: t.active ? "green" : "gray",
                }}
              >
                {t.active ? "Active ✅" : "Ticket expired ❌"}
              </span>

              <p><strong>Bus ID:</strong> {t.busId || "N/A"}</p>
              <p><strong>Bus Name:</strong> {t.busName || "N/A"}</p>
              <p><strong>User:</strong> {t.userName || "N/A"}</p>
              <p><strong>Start:</strong> {t.start?.lat ?? "-"}, {t.start?.lng ?? "-"}</p>
              <p><strong>Destination:</strong> {t.destination?.lat ?? "-"}, {t.destination?.lng ?? "-"}</p>
              <p><strong>Distance:</strong> {t.distance ?? "-"} km</p>
              <p><strong>Fare:</strong> ₹{t.amount ?? "-"}</p>
              <p><strong>Date:</strong> {t.date ? new Date(t.date).toLocaleString() : "-"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tickets;
