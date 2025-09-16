import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Map from "./Map";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Paper,
  Stack,
  Divider,
} from "@mui/material";

export default function BusDetailMUI() {
  const { id } = useParams();
  const location = useLocation();

  const buses = JSON.parse(localStorage.getItem("buses")) || [];
  const bus =
    location.state || buses.find((b) => String(b.id) === String(id)) ||
    { id, name: "Unknown Bus" };

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
    setRouteInfo(data);
    setShowMap(false);
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
      alert("Ticket booked successfully!");
    } catch (err) {
      console.error("Failed to book ticket:", err);
      alert("Failed to book ticket. Try again.");
    } finally {
      setLoadingPay(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Bus Details
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }} elevation={2}>
        <Typography><strong>Bus ID:</strong> {bus.id}</Typography>
        <Typography><strong>Bus Name:</strong> {bus.name}</Typography>
        <Typography><strong>Logged-in User:</strong> {userName}</Typography>
      </Paper>

      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Button
          variant="contained"
          onClick={() => setShowMap(true)}
          sx={{
            backgroundColor:"#ff9100ff",
            color: showMap ? "black" : undefined,
            "&:hover": {
              backgroundColor: showMap ? "#ff9a1a" : undefined,
            },
          }}
        >
          Find Route
        </Button>

        {routeInfo && (
          <Paper sx={{ p: 2, minWidth: 280 }}>
            <Typography variant="subtitle2">Route Selected</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">
              <strong>Start:</strong> {routeInfo.start.lat}, {routeInfo.start.lng}
            </Typography>
            <Typography variant="body2">
              <strong>Destination:</strong> {routeInfo.destination.lat}, {routeInfo.destination.lng}
            </Typography>
            <Typography variant="body2">
              <strong>Distance:</strong> {routeInfo.distance} km &nbsp; | &nbsp;
              <strong>Fare:</strong> ₹{calculateFare(routeInfo.distance).toFixed(2)}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={handlePay}
                disabled={loadingPay}
                sx={{
                  backgroundColor: "#28a745",
                  "&:hover": { backgroundColor: "#2fb85a" },
                }}
              >
                {loadingPay ? "Processing..." : "Pay"}
              </Button>
            </Box>
          </Paper>
        )}
      </Stack>

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