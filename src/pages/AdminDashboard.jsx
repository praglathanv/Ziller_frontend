  // src/pages/AdminDashboard.js
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Divider,
    Stack,
  } from "@mui/material";
  import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
  import AddIcon from "@mui/icons-material/Add";
  import HistoryIcon from "@mui/icons-material/History";
  import VisibilityIcon from "@mui/icons-material/Visibility";
  import BoltIcon from "@mui/icons-material/Bolt";

  function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin");
        return;
      }

      const fetchAdmin = async () => {
        try {
          const res = await axios.get("https://ziller-backend.onrender.com/api/admin/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAdmin(res.data);
        } catch (err) {
          console.error(err);
          navigate("/admin");
        } finally {
          setLoading(false);
        }
      };

      fetchAdmin();
    }, [navigate]);

    const handleCreateSession = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.put(
          `https://ziller-backend.onrender.com/api/admin/${admin._id}/session`,
          { currentSession: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate("/create-session");
      } catch (err) {
        console.error("Failed to create session:", err);
        alert("Failed to create session");
      }
    };

    const keyframes = {
      "@keyframes moveGradient": {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
      },
    };

    if (loading)
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#0a0602",
          }}
        >
          <CircularProgress sx={{ color: "#ff7e00" }} />
        </Box>
      );

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(120deg, #0a0602, #1c0b00, #2b1200, #1c0b00, #0a0602)",
          backgroundSize: "200% 200%",
          animation: "moveGradient 18s ease-in-out infinite",
          ...keyframes,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pattern overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,120,20,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.6,
          }}
        />

        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 5 },
            width: { xs: "90%", sm: "480px" },
            borderRadius: 4,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            backdropFilter: "blur(12px) saturate(140%)",
            border: "1px solid rgba(255,120,0,0.2)",
            boxShadow:
              "0 8px 30px rgba(255,120,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            zIndex: 5,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <AdminPanelSettingsIcon
              sx={{
                color: "#ff7e00",
                fontSize: 60,
                textShadow: "0 0 20px rgba(255,126,0,0.5)",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              color: "#fff4e5",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography sx={{ color: "#ffddb0", mb: 3, fontSize: 14 }}>
            Welcome back, <strong>{admin.username}</strong> 👋
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

          {/* Action Buttons */}
          <Stack spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/add-admin")}
              sx={{
                borderRadius: 3,
                py: 1.3,
                background:
                  "linear-gradient(90deg, #ffb347, #ff7e00, #ffb347)",
                backgroundSize: "200%",
                transition: "all 0.3s ease",
                fontWeight: 700,
                color: "#1a0a00",
                "&:hover": {
                  backgroundPosition: "right center",
                  transform: "translateY(-3px)",
                },
              }}
            >
              Add Admin
            </Button>

            <Button
              variant="contained"
              startIcon={<HistoryIcon />}
              onClick={() => navigate("/bus-collection")}
              sx={{
                borderRadius: 3,
                py: 1.3,
                background:
                  "linear-gradient(90deg, #007bff, #0095ff, #007bff)",
                backgroundSize: "200%",
                transition: "all 0.3s ease",
                fontWeight: 700,
                "&:hover": {
                  backgroundPosition: "right center",
                  transform: "translateY(-3px)",
                },
              }}
            >
              Ticket History
            </Button>

            {admin.currentSession ? (
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate("/create-session")}
                sx={{
                  borderRadius: 3,
                  py: 1.3,
                  background:
                    "linear-gradient(90deg, #17a2b8, #26c6da, #17a2b8)",
                  backgroundSize: "200%",
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundPosition: "right center",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                View Session
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<BoltIcon />}
                onClick={handleCreateSession}
                sx={{
                  borderRadius: 3,
                  py: 1.3,
                  background:
                    "linear-gradient(90deg, #ffcc33, #ffb347, #ffcc33)",
                  backgroundSize: "200%",
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                  color: "#1a0a00",
                  "&:hover": {
                    backgroundPosition: "right center",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                Create Session
              </Button>
            )}
          </Stack>

          <Typography
            sx={{
              mt: 4,
              fontSize: 12,
              color: "#804a00",
            }}
          >
            © {new Date().getFullYear()} Ziller Admin — Powered by Senju Kirmada
          </Typography>
        </Paper>
      </Box>
    );
  }

  export default AdminDashboard;
