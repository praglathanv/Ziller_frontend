// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Map from "./pages/map";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import BusCollection from "./pages/BusCollection";
import AddAdmin from "./pages/AddAdmin";
import Home from "./pages/Home";
import BusDetail from "./pages/BusDetail";
import Tickets from "./pages/Tickets";  
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoutes";
import CreateSession from "./pages/CreateSession";
import About from "./pages/About";
import PassPage from "./pages/PassPage";

function App() {
  const token = localStorage.getItem("token"); // check if logged in

  return (
    <Router>
      <Routes>
        {/* Home redirects to login if not logged in */}
        <Route
          path="/"
          element={
            token ? <Home /> : <Navigate to="/login" replace />
          }
        />

        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/bus/:id"
          element={
            <ProtectedRoute>
              <BusDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />

         <Route
          path="/take-pass"
          element={
            <ProtectedRoute>
              <PassPage />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />

        {/* Admin routes (you can protect later if needed) */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/bus-collection" element={<BusCollection />} />
        <Route path="/add-admin" element={<AddAdmin />} />
        <Route path="/create-session" element={<CreateSession />} />
      </Routes>
    </Router>
  );
}

export default App;
