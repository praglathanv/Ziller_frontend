import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import homeBanner from "../assets/images/home_banner.png";
import Zillerlogo from "../assets/images/zillerlogo.png";
import {
  Box,
  Typography,
  Button,
  TextField,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Paper,
  Avatar,
  InputAdornment,
  Fade,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function HomeFuturistic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)"); // ✅ detect mobile/tablet only

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setAdmins([]);
      return;
    }
    const id = setTimeout(() => {
      (async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`https://ziller-backend.onrender.com/api/admin/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const filtered = res.data
            .filter((a) => a.currentSession === true)
            .filter((a) =>
              a.username.toLowerCase().includes(searchQuery.toLowerCase())
            );

          setAdmins(filtered.slice(0, 6));
        } catch (err) {
          console.error("Failed to fetch admins (UI only):", err);
          setAdmins([
            { _id: "demo1", username: "NeoDriver" },
            { _id: "demo2", username: "OrbitBus" },
          ]);
        }
      })();
    }, 300);

    return () => clearTimeout(id);
  }, [searchQuery]);

  const showSuggestions = useMemo(() => searchQuery.trim().length > 0, [searchQuery]);

  return (
    <Box
      className="min-h-screen w-full bg-gradient-to-br from-[#1a0a00] to-[#2a1400] relative overflow-hidden"
      sx={{
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto',
      }}
    >
      {/* Background grid */}
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

      {/* Top Bar */}
      <Box className="flex items-center justify-between px-6 md:px-12 py-6 z-20 relative">
        <Box className="flex items-center gap-4">
          <Avatar src={Zillerlogo} alt="Ziller" sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6" sx={{ color: "#fff4e5", fontWeight: 800 }}>
              Ziller
            </Typography>
            <Typography variant="caption" sx={{ color: "#ffc17a" }}>
              Move. Evolve. Repeat.
            </Typography>
          </Box>
        </Box>

        {/* Desktop Nav */}
        <Box className="hidden md:flex items-center gap-4">
          <Button
            variant="text"
            onClick={() => navigate("/tickets")}
            sx={{ color: "#ffe8cc", textTransform: "none", fontWeight: 700 }}
            startIcon={<HistoryIcon />}
          >
            History
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/take-pass")}
            sx={{ color: "#ffe8cc", textTransform: "none", fontWeight: 700 }}
          >
            Take Pass
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/about")}
            sx={{ color: "#ffe8cc", textTransform: "none", fontWeight: 700 }}
            startIcon={<InfoIcon />}
          >
            About
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/admin")}
            sx={{
              ml: 2,
              background: "linear-gradient(90deg,#ff7e00,#ffb347)",
              color: "#1a0a00",
              fontWeight: 800,
              px: 3,
              py: 1,
              borderRadius: 3,
              boxShadow: "0 8px 30px rgba(255, 140, 0, 0.25)",
            }}
            startIcon={<AdminPanelSettingsIcon />}
          >
            Admin
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            startIcon={<LogoutIcon />}
            sx={{
              color: "#ffe8cc",
              borderColor: "rgba(255,200,150,0.25)",
              textTransform: "none",
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Menu Icon (Mobile Only) */}
        {isMobile && (
          <IconButton onClick={() => setMenuOpen(true)} sx={{ color: "#ffcc70" }}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Main Content */}
      <Box className="flex flex-col md:flex-row items-center md:items-start gap-6 px-6 md:px-12 mt-6 z-20 relative">
        {/* Left Text + Search */}
        <Box className="flex-1 flex flex-col gap-4 max-w-xl md:max-w-lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#fff4e5",
              fontSize: { xs: 28, md: 48 },
            }}
          >
            No More Regret. <br /> Take the Change.
          </Typography>

          <Typography sx={{ color: "#ffdca8", lineHeight: 1.6 }}>
            Futuristic transport management with instant passes and real-time driver
            availability. Search a driver, book a pass, or review your history — all inside
            a minimal, focused UI.
          </Typography>

          {/* Search Bar */}
          <Paper
            elevation={6}
            sx={{
              p: 2,
              borderRadius: 3,
              backdropFilter: "blur(6px)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              width: { xs: "100%", md: "95%" },
              maxWidth: 720,
            }}
          >
            <Box className="flex items-center gap-3">
              <TextField
                fullWidth
                placeholder="Search drivers, e.g. 'NeoDriver'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 180)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    paddingRight: 0,
                    "& fieldset": { border: "1px solid rgba(255,255,255,0.08)" },
                    "&:hover fieldset": {
                      border: "1px solid rgba(255,140,0,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      border: "1px solid rgba(255,180,0,0.8)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#fff4e5",
                    fontWeight: 700,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#ffdca8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => {
                          if (admins.length)
                            navigate(`/bus/${admins[0]._id}`, {
                              state: {
                                id: admins[0]._id,
                                name: admins[0].username,
                              },
                            });
                        }}
                        sx={{
                          textTransform: "none",
                          fontWeight: 800,
                          color: "#1a0a00",
                          background: "linear-gradient(90deg,#ff7e00,#ffb347)",
                          borderRadius: 2,
                          px: 2,
                          py: 0.8,
                        }}
                      >
                        Go
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Suggestions */}
            <Fade in={showSuggestions && (focused || admins.length > 0)}>
              <Box sx={{ mt: 1 }}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: "rgba(40,20,0,0.8)",
                    borderRadius: 2,
                    maxHeight: 260,
                    overflow: "auto",
                  }}
                >
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <Box
                        key={admin._id}
                        onClick={() =>
                          navigate(`/bus/${admin._id}`, {
                            state: { id: admin._id, name: admin.username },
                          })
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1,
                          px: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { background: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#ff7e00",
                            color: "#1a0a00",
                          }}
                        >
                          {admin.username?.charAt(0)?.toUpperCase() || "A"}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: "#fff4e5", fontWeight: 800 }}>
                            {admin.username}
                          </Typography>
                          <Typography sx={{ color: "#ffdca8", fontSize: 12 }}>
                            Available now • {Math.floor(Math.random() * 10) + 1} min
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "#ffb347", fontWeight: 800 }}>
                          Go
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ p: 2 }}>
                      <Typography sx={{ color: "#ffdca8" }}>
                        No drivers found — try another name or clear search.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Fade>
          </Paper>

          <Box className="flex gap-3 mt-3">
            <Button
              onClick={() => navigate("/tickets")}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 2,
                px: 3,
                bgcolor: "transparent",
                color: "#ffdca8",
              }}
            >
              View History
            </Button>

            <Button
              onClick={() => navigate("/take-pass")}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 2,
                px: 3,
                background: "linear-gradient(90deg,#ff7e00,#ffb347)",
                color: "#1a0a00",
              }}
            >
              Get Pass
            </Button>
          </Box>
        </Box>

        {/* Banner */}
        <Box className="flex-1 flex flex-col items-center md:items-end gap-4 w-full">
          <Box sx={{ width: { xs: "80%", md: "520px" }, position: "relative" }}>
            <Box
              component="img"
              src={homeBanner}
              alt="banner"
              sx={{ width: "100%", display: "block", borderRadius: 3 }}
            />

            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                bottom: -18,
                left: { xs: "6%", md: "6%" },
                right: { xs: "6%", md: "auto" },
                display: "flex",
                gap: 2,
                alignItems: "center",
                p: 1.5,
                borderRadius: 2.5,
                backdropFilter: "blur(6px)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                minWidth: 240,
              }}
            >
              <Avatar sx={{ bgcolor: "#ff7e00", color: "#1a0a00" }}>Z</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 900, color: "#fff4e5" }}>
                  Fast Fleet
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#ffdca8" }}>
                  24 active drivers
                </Typography>
              </Box>
              <Button
                sx={{
                  ml: "auto",
                  textTransform: "none",
                  fontWeight: 800,
                  background: "linear-gradient(90deg,#ff7e00,#ffb347)",
                  color: "#1a0a00",
                }}
              >
                Explore
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* ✅ Mobile Drawer only visible on mobile */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          PaperProps={{
            sx: { background: "#1a0a00", color: "#ffdca8" },
          }}
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Box className="flex items-center gap-3 mb-3">
              <Avatar src={Zillerlogo} />
              <Box>
                <Typography sx={{ fontWeight: 900 }}>Ziller</Typography>
                <Typography sx={{ fontSize: 12, color: "#ffb347" }}>
                  Smart rides
                </Typography>
              </Box>
            </Box>
            <List>
              {[
                { label: "History", to: "/tickets" },
                { label: "Take Pass", to: "/take-pass" },
                { label: "About Us", to: "/about" },
                { label: "Admin", to: "/admin" },
              ].map((item) => (
                <ListItemButton
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(item.to);
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}

              <ListItemButton
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      )}

      {/* Footer */}
      <Box className="w-full text-center py-6 mt-12 z-20 relative">
        <Typography sx={{ color: "#804a00", fontSize: 13 }}>
          © {new Date().getFullYear()} Ziller — Design by Senju Kirmada
        </Typography>
      </Box>
    </Box>
  );
}
