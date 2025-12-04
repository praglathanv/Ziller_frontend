// src/pages/BusDetailMUI.jsx
import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Map from "./Map";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Paper,
  Avatar,
  Fade,
} from "@mui/material";

export default function BusDetailMUI() {
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const buses = JSON.parse(localStorage.getItem("buses")) || [];
  const bus =
    location.state ||
    buses.find((b) => String(b.id) === String(id)) || { id, name: "Unknown Bus" };

  const [showMap, setShowMap] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userName = user?.name || "Guest";
  const userId = user?.id || null;

  const calculateFare = (km) => {
    if (!km) return 0;
    if (km <= 10) return 6;
    return 6 + (km - 10) * 0.58;
  };

let alertShown = false;

const handleRouteComplete = (data) => {
  if (alertShown) return;
  alertShown = true;

  setShowMap(false);

  Swal.fire({
    title: "Done!",
    text: "Route selected successfully.",
    icon: "success",
    timer: 1400,
    showConfirmButton: false,
    position: "center",
  });

  setTimeout(() => {
    setRouteInfo(data);
  }, 1200);
};


  const handlePay = async () => {
    if (!routeInfo || !userId) return;
    setLoadingPay(true);

    const ticketData = {
      busId: bus.id,
      busName: bus.name,
      userId,
      userName,
      start: routeInfo.start,
      destination: routeInfo.destination,
      distance: routeInfo.distance,
      amount: Number(calculateFare(routeInfo.distance)).toFixed(2),
      date: new Date().toISOString(),
    };

    try {
      await axios.post("https://ziller-backend.onrender.com/api/tickets", ticketData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Ticket booked successfully!",
        icon: "success",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      console.error("Failed to book ticket:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to book ticket. Try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoadingPay(false);
    }
  };

  const keyframes = {
    "@keyframes moveGradient": {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
        background:
          "linear-gradient(120deg, #0a0602, #1c0b00, #2b1200, #1c0b00, #0a0602)",
        backgroundSize: "200% 200%",
        animation: "moveGradient 18s ease-in-out infinite",
        ...keyframes,
        fontFamily: '"Poppins", sans-serif',
        pb: 6,
      }}
    >
      {/* Pattern Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,120,20,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          px: { xs: 3, sm: 5, md: 8 },
          pt: { xs: 3, sm: 4 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#fff4e5",
            fontWeight: 900,
            fontSize: { xs: 20, sm: 30, md: 34 },
            letterSpacing: 0.4,
          }}
        >
          Bus Details
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4, md: 8 },
          position: "relative",
          zIndex: 6,
        }}
      >
        {/* NEW — Glass Card (matching AdminDashboard styling) */}
        <Fade in appear>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 3, sm: 4 },
              width: { xs: "95%", sm: "480px" },
              borderRadius: 4,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              backdropFilter: "blur(12px) saturate(140%)",
              border: "1px solid rgba(255,120,0,0.18)",
              boxShadow:
                "0 8px 30px rgba(255,120,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
              color: "#fff4e5",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "#ff7e00", color: "#fff" }}>
                {String(userName || "G").charAt(0).toUpperCase()}
              </Avatar>
              <Typography sx={{ fontWeight: 900, color: "#fff4e5" }}>
                {userName}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 2 }} />

            {/* Bus Info */}
            <Typography sx={{ fontSize: 14 }}>
              <strong>Bus ID:</strong> {bus.id}
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              <strong>Bus Name:</strong> {bus.name}
            </Typography>

            {/* Route Info */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 14 }}>
                <strong>Start:</strong>{" "}
                {routeInfo?.start
                  ? `${routeInfo.start.lat}, ${routeInfo.start.lng}`
                  : "Not selected"}
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                <strong>Destination:</strong>{" "}
                {routeInfo?.destination
                  ? `${routeInfo.destination.lat}, ${routeInfo.destination.lng}`
                  : "Not selected"}
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                <strong>Distance:</strong>{" "}
                {routeInfo?.distance ? `${routeInfo.distance} km` : "0 km"}
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                <strong>Fare:</strong> ₹
                {routeInfo?.distance
                  ? calculateFare(routeInfo.distance).toFixed(2)
                  : "0.00"}
              </Typography>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: "grid",
                gap: 1.2,
                alignItems: "center",
                justifyContent: "center",
                mt: 3,
              }}
            >
              <Button
                fullWidth
                onClick={() => (routeInfo ? handlePay() : setShowMap(true))}
                disabled={loadingPay}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px:10,
                  fontWeight: 800,
                  background: routeInfo
                    ? "linear-gradient(90deg, #28a745, #1fa43a)"
                    : "linear-gradient(90deg,#ffb347,#ff7e00)",
                  color: "#1a0a00",
                  "&:hover": {
                    backgroundPosition: "right",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                {routeInfo ? (loadingPay ? "Processing..." : "Pay") : "Find Route"}
              </Button>
              

              <Button
                onClick={() => (window.location.href = "/tickets")}
                sx={{ color: "#ff7e00", fontWeight: 700 }}
              >
                View History
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Box>

      {/* Dialog */}
      <Dialog open={showMap} onClose={() => setShowMap(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ background: "transparent", color: "#da9d2cff" }}>
          Select Route on Map
        </DialogTitle>
        <DialogContent
          sx={{ height: { xs: "60vh", sm: "70vh" }, p: 0, background: "#e49a46ff" }}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <Map onRouteComplete={handleRouteComplete} />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: "center", zIndex: 6 }}>
        <Typography sx={{ color: "#804a00", fontSize: 13 }}>
          © {new Date().getFullYear()} Ziller — Design by Ziller Team
        </Typography>
      </Box>
    </Box>
  );
}
