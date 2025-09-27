import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Ticket from "../assets/images/ticket.png";
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

  const handleRouteComplete = (data) => {
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
      await axios.post("http://localhost:5000/api/tickets", ticketData, {
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

  return (
    <Box sx={{ backgroundColor: "#e0e0e0ff", minHeight: "100vh" }}>
      {/* Title */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
        background: "radial-gradient(circle at bottom left, orange 60%, white 120%)",
          height: { xs: 50, sm: 80 },
          display: "flex",
          alignItems: "center",
          pl: {xs:3,sm: 5},
          color: "white",
          fontFamily: "revert-layer",
          fontSize: { xs: 26, sm: 42 },
          fontWeight: 900,
          borderRadius: 1,
        }}
      >
        Bus Details
      </Typography>

      {/* IMAGE + CENTERED PAPER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          mt: 3,
        }}
      >
        {/* Background Ticket Image */}
        <img
          src={Ticket}
          alt="Ticket"
          style={{
            width: isMobile ? "88%" : "400px",
            height: "auto",
            display: "block",
          }}
        />

        {/* White Paper Overlay */}
        <Box
          sx={{
            position: "absolute",
            p: 3,
            width: { xs: "80%", sm: "20%" },
            bgcolor: "transparent",
          }}
        >
          {/* Bus Details */}
          <Typography><strong>Bus ID:</strong> {bus.id}</Typography>
          <Typography><strong>Bus Name:</strong> {bus.name}</Typography>
          <Typography><strong>Logged-in User:</strong> {userName}</Typography>

          {/* ✅ Route Info Always Visible */}
          <Typography variant="body2">
            <strong>Start:</strong>{" "}
            {routeInfo?.start
              ? `${routeInfo.start.lat}, ${routeInfo.start.lng}`
              : "Not selected"}
          </Typography>
          <Typography variant="body2">
            <strong>Destination:</strong>{" "}
            {routeInfo?.destination
              ? `${routeInfo.destination.lat}, ${routeInfo.destination.lng}`
              : "Not selected"}
          </Typography>
          <Typography variant="body2">
            <strong>Distance:</strong>{" "}
            {routeInfo?.distance ? `${routeInfo.distance} km` : "0 km"}
          </Typography>
          <Typography variant="body2">
            <strong>Fare:</strong> ₹
            {routeInfo?.distance
              ? calculateFare(routeInfo.distance).toFixed(2)
              : "0.00"}
          </Typography>

          {/* Button */}
          <Button
            fullWidth={isMobile}
            onClick={() => (routeInfo ? handlePay() : setShowMap(true))}
            disabled={loadingPay}
            sx={{
              mt: 2,
              border: routeInfo ? "3px solid #28a745" : "3px solid #ff9100ff",
              color: routeInfo ? "#28a745" : "#ff9100ff",
              borderRadius: 3,
              backgroundColor: routeInfo ? "#ffffffff" : "#ffffffff",
              width: isMobile ? "70%" : "150px",
              "&:hover": {
                backgroundColor: routeInfo ? "#28a745" : "#ff9a1a",
                color: "white",
              },
            }}
          >
            {routeInfo ? (loadingPay ? "Processing..." : "Pay") : "Find Route"}
          </Button>
        </Box>
      </Box>

      {/* Map Dialog */}
      <Dialog open={showMap} onClose={() => setShowMap(false)} fullWidth maxWidth="md">
        <DialogTitle>Select route on map</DialogTitle>
        <DialogContent sx={{ height: { xs: "60vh", sm: "70vh" }, p: 0 }}>
          <Box sx={{ width: "100%", height: "100%" }}>
            <Map onRouteComplete={handleRouteComplete} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
