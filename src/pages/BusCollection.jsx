// AdminTickets.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  Stack,
  Button,
  useMediaQuery,
} from "@mui/material";

import HistoryIcon from "@mui/icons-material/History";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

import Zillerlogo from "../assets/images/zillerlogo.png";
import { useNavigate } from "react-router-dom";

export default function AdminTickets() {
  const [admin, setAdmin] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
      return;
    }

    // ---- FETCH ADMIN ----
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("https://ziller-backend.onrender.com/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
        return res.data;
      } catch (err) {
        console.error("Admin fetch failed", err);
        navigate("/admin");
      }
    };

    // ---- FETCH TICKETS ----
    const fetchTickets = async (adminData) => {
      try {
        const res = await axios.get("https://ziller-backend.onrender.com/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter(
          (t) =>
            t.busName === adminData.username ||
            t.busName === adminData.busName
        );

        setTickets(filtered);
      } catch (err) {
        console.error("Ticket fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin().then((a) => {
      if (a) fetchTickets(a);
    });
  }, [navigate]);

  if (!admin || loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#1a0a00",
        }}
      >
        <CircularProgress sx={{ color: "#ffb347" }} />
      </Box>
    );
  }

  return (
    <Box
      className="min-h-screen w-full bg-gradient-to-br from-[#1a0a00] to-[#2a1400] relative overflow-hidden"
      sx={{
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto',
        color: "#fff4e5",
      }}
    >
      {/* BG Design */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02), transparent)",
          backgroundSize: "40px 40px, 100% 100%",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <Box className="flex items-center justify-between px-6 md:px-12 py-6 z-20 relative">
        <Box className="flex items-center gap-4">
          <Avatar src={Zillerlogo} alt="Ziller" sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6" sx={{ color: "#fff4e5", fontWeight: 800 }}>
              Ziller Admin
            </Typography>
            <Typography variant="caption" sx={{ color: "#ffc17a" }}>
              Tickets for {admin.username}
            </Typography>
          </Box>
        </Box>

        <Box className="hidden md:flex items-center gap-3">
          <Button
            variant="text"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/admin/dashboard")}
            sx={{
              color: "#ffe8cc",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Dashboard
          </Button>

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin");
            }}
            sx={{
              color: "#ffe8cc",
              borderColor: "rgba(255,200,150,0.25)",
              textTransform: "none",
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* TICKETS SECTION */}
      <Box
        className="z-20 relative"
        sx={{
          px: { xs: 3, md: 10 },
          py: 4,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <HistoryIcon sx={{ color: "#ffb347" }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: "#fff4e5", letterSpacing: 0.5 }}
          >
            Bus Ticket History
          </Typography>
        </Stack>

        {tickets.length === 0 ? (
          <Paper
            elevation={4}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            }}
          >
            <Typography sx={{ color: "#ffdca8" }}>
              No tickets found for your bus.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {tickets.map((t, idx) => (
              <Paper
                key={t._id || idx}
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backdropFilter: "blur(6px)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,180,0,0.15)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(255,140,0,0.2)",
                  },
                }}
              >
                {/* TITLE HEADER */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.2}>
                    <ConfirmationNumberIcon sx={{ color: "#ffb347" }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: "#fff" }}
                    >
                      {t.busName || "Bus Name N/A"}
                    </Typography>
                  </Stack>

                  <Chip
                    label={t.active ? "Active ✅" : "Expired ❌"}
                    size="small"
                    sx={{
                      bgcolor: t.active
                        ? "rgba(60,255,100,0.15)"
                        : "rgba(255,255,255,0.08)",
                      color: t.active ? "#80ff80" : "#ffdca8",
                      borderRadius: 2,
                      fontWeight: 700,
                    }}
                  />
                </Box>

                {/* DETAILS */}
                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>Ticket ID:</strong> {t._id}
                </Typography>

                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>User:</strong> {t.userName || "N/A"}
                </Typography>

                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>User ID:</strong> {t.userId || "-"}
                </Typography>

                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>Start:</strong> {t.start?.lat ?? "-"},{" "}
                  {t.start?.lng ?? "-"}
                </Typography>

                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>Destination:</strong> {t.destination?.lat ?? "-"},{" "}
                  {t.destination?.lng ?? "-"}
                </Typography>

                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>Distance:</strong> {t.distance ?? "-"} km
                </Typography>

                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>Fare:</strong> ₹{t.amount}
                </Typography>

                <Typography sx={{ color: "#ffdca8" }}>
                  <strong>Date:</strong>{" "}
                  {t.date ? new Date(t.date).toLocaleString() : "-"}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      {/* FOOTER */}
      <Box className="w-full text-center py-6 mt-8 z-20 relative">
        <Typography sx={{ color: "#804a00", fontSize: 13 }}>
          © {new Date().getFullYear()} Ziller — Admin Panel by Senju Kirumada
        </Typography>
      </Box>
    </Box>
  );
}
