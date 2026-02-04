import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./pages/ProtectedRoutes";

import BusDetail from "./pages/BusDetail";
import Tickets from "./pages/Tickets";
import PassPage from "./pages/PassPage";
import About from "./pages/About";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import BusCollection from "./pages/BusCollection";
import AddAdmin from "./pages/AddAdmin";
import CreateSession from "./pages/CreateSession";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />

        {/* Public */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
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

        {/* Admin */}
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
