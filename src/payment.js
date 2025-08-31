// src/Payment.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, amount } = location.state || {};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Page</h2>
      {bus ? (
        <>
          <p><strong>Bus:</strong> {bus.name}</p>
          <p><strong>Fare:</strong> ₹{amount}</p>

          <button
            onClick={() => {
              alert("Payment Successful ✅");
              navigate("/"); // go back home after pay
            }}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Pay Now
          </button>
        </>
      ) : (
        <p>No payment info available</p>
      )}
    </div>
  );
}

export default Payment;
