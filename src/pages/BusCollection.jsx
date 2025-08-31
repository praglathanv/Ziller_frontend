// AdminTickets.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminTickets = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
      return;
    }

    // Fetch admin info
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(res.data);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch admin:", err);
        navigate("/admin");
      }
    };

    // Fetch tickets after admin is fetched
    const fetchTickets = async (adminData) => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("All tickets:", res.data);

        // ✅ Match tickets by busName
        const filteredTickets = res.data.filter(
          (t) => t.busName === adminData.username || t.busName === adminData.busName
        );

        console.log("Filtered tickets for admin:", filteredTickets);
        setTickets(filteredTickets);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      }
    };

    fetchAdmin().then((adminData) => {
      if (adminData) fetchTickets(adminData);
    });
  }, [navigate]);

  if (!admin) return <p>Loading admin info...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎟️ Tickets for {admin.username}</h2>

      {tickets.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tickets.map((ticket) => (
            <li
              key={ticket._id}
              style={{
                padding: "15px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <p><strong>Ticket ID:</strong> {ticket._id}</p>
              <p><strong>User Name:</strong> {ticket.userName}</p>
              <p><strong>Bus:</strong> {ticket.busName}</p>
              <p><strong>User ID:</strong> {ticket.userId}</p>
              <p><strong>Amount:</strong> ₹{ticket.amount}</p>
              <p>
                <strong>Date:</strong>{" "}
                {ticket.date ? new Date(ticket.date).toLocaleString() : "N/A"}
              </p>
              {ticket.start && ticket.destination && (
                <>
                  <p>
                    <strong>From:</strong> {ticket.start.lat}, {ticket.start.lng}
                  </p>
                  <p>
                    <strong>To:</strong> {ticket.destination.lat}, {ticket.destination.lng}
                  </p>
                  <p><strong>Distance:</strong> {ticket.distance} km</p>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tickets found for your bus.</p>
      )}
    </div>
  );
};

export default AdminTickets;
