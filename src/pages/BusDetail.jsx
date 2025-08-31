import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Map from "./map";
import axios from "axios"; // ✅ import axios

function BusDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const buses = JSON.parse(localStorage.getItem("buses")) || [];
  const bus =
    location.state ||
    buses.find((b) => String(b.id) === String(id)) ||
    { id, name: "Unknown Bus" };

  const [showMap, setShowMap] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userName = user?.name || "Guest";
  const userId = user?.id || null;

  const handleRouteComplete = (data) => {
    setRouteInfo(data);
    setShowMap(false);
  };

  const calculateFare = (km) => {
    if (km <= 10) return 6;
    return 6 + (km - 10) * 0.58;
  };

  const handlePay = async () => {
    if (!routeInfo || !userId) return;

    const ticketData = {
      busId: bus.id,
      busName: bus.name,
      userId,
      userName,
      start: routeInfo.start,
      destination: routeInfo.destination,
      distance: routeInfo.distance,
      amount: calculateFare(routeInfo.distance).toFixed(2),
      date: new Date().toISOString(),
    };

    console.log(ticketData)

    try {
      // ✅ Save ticket to backend
      await axios.post("http://localhost:5000/api/tickets", ticketData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if backend needs auth
        },
      });

      alert("Ticket booked successfully!");

      // ✅ Navigate to Payment page
      /*navigate("/payment", {
        state: {
          bus,
          amount: ticketData.amount,
          routeInfo: ticketData,
        },
      });*/
    } catch (err) {
      console.error("Failed to book ticket:", err);
      alert("Failed to book ticket. Try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bus Details</h2>
      <p><strong>Bus ID:</strong> {bus.id}</p>
      <p><strong>Bus Name:</strong> {bus.name}</p>
      <p><strong>Logged-in User:</strong> {userName}</p>

      {!showMap ? (
        <>
          <button
            onClick={() => setShowMap(true)}
            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginTop: "10px" }}
          >
            Find Route
          </button>

          {routeInfo && (
            <div style={{ marginTop: "20px", fontSize: "16px" }}>
              <p><strong>Start:</strong> {routeInfo.start.lat}, {routeInfo.start.lng}</p>
              <p><strong>Destination:</strong> {routeInfo.destination.lat}, {routeInfo.destination.lng}</p>
              <p><strong>Distance:</strong> {routeInfo.distance} km &nbsp; | &nbsp;
                 <strong>Fare:</strong> ₹{calculateFare(routeInfo.distance).toFixed(2)}</p>

              <button
                onClick={handlePay} // ✅ call new function
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Pay
              </button>
            </div>
          )}
        </>
      ) : (
        <Map onRouteComplete={handleRouteComplete} />
      )}
    </div>
  );
}

export default BusDetail;
