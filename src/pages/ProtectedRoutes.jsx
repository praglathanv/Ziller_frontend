// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />; // redirect to login if not
  }
  return children; // render the page if logged in
}

export default ProtectedRoute;
