import React, { useState, useEffect } from "react";
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
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Zillerlogo from "../assets/images/zillerlogo.png";
import { useNavigate } from "react-router-dom";

/* ============================================================
   BUY PASS SECTION (FULL FORM)
   ============================================================ */
const BuyPass = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const PASS_TYPES = {
    daily: 50,
    weekly: 250,
    monthly: 900,
  };

  useEffect(() => {
    if (type) {
      setPrice(PASS_TYPES[type] || 0);
    }
  }, [type]);

  const handleBuy = async () => {
    if (!start || !end || !type) return alert("Please fill all fields");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://ziller-backend.onrender.com/api/passes/create",
        {
          startPoint: start,
          endPoint: end,
          passType: type,
          price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Pass purchased successfully!");
      setStart("");
      setEnd("");
      setType("");
    } catch (err) {
      alert("Failed to create pass");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 900, color: "#fff4e5", mb: 2 }}
      >
        Buy New Pass
      </Typography>

      <Stack spacing={2}>
        <TextField
          select
          label="Start Point"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.08)",
              color: "white",
            },
          }}
        >
          <MenuItem value="Anna Nagar">Anna Nagar</MenuItem>
          <MenuItem value="Tambaram">Tambaram</MenuItem>
          <MenuItem value="Koyambedu">Koyambedu</MenuItem>
        </TextField>

        <TextField
          select
          label="End Point"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.08)",
              color: "white",
            },
          }}
        >
          <MenuItem value="Anna Nagar">Anna Nagar</MenuItem>
          <MenuItem value="Tambaram">Tambaram</MenuItem>
          <MenuItem value="Koyambedu">Koyambedu</MenuItem>
        </TextField>

        <TextField
          select
          label="Pass Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.08)",
              color: "white",
            },
          }}
        >
          <MenuItem value="daily">Daily Pass</MenuItem>
          <MenuItem value="weekly">Weekly Pass</MenuItem>
          <MenuItem value="monthly">Monthly Pass</MenuItem>
        </TextField>

        <Typography sx={{ color: "#ffdca8" }}>
          <strong>Price:</strong> ₹{price}
        </Typography>

        <Button
          variant="contained"
          onClick={handleBuy}
          disabled={loading}
          sx={{
            background: "#ffb347",
            color: "#000",
            fontWeight: 800,
            "&:hover": { background: "#ff9800" },
          }}
        >
          {loading ? "Processing..." : "Buy Pass"}
        </Button>
      </Stack>
    </Box>
  );
};

/* ============================================================
   VIEW PASS SECTION (HISTORY UI LIKE TICKET PAGE)
   ============================================================ */
const ViewPass = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://ziller-backend.onrender.com/api/passes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPasses(res.data || []);
      } catch (err) {
        console.error(err);
        setPasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPasses();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "#ffb347" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <HistoryIcon sx={{ color: "#ffb347" }} />
        <Typography variant="h5" sx={{ fontWeight: 900, color: "#fff4e5" }}>
          Pass History
        </Typography>
      </Stack>

      {passes.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 3,
          }}
        >
          <Typography sx={{ color: "#ffdca8" }}>No passes found.</Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {passes.map((p, idx) => (
            <Paper
              key={idx}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,180,0,0.15)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <CardMembershipIcon sx={{ color: "#ffb347" }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {p.passType}
                  </Typography>
                </Stack>

                <Chip
                  label={p.active ? "Active" : "Expired"}
                  sx={{
                    bgcolor: p.active
                      ? "rgba(60,255,100,0.15)"
                      : "rgba(255,255,255,0.08)",
                    color: p.active ? "#80ff80" : "#ffdca8",
                  }}
                />
              </Stack>

              <Typography sx={{ color: "#ffdca8" }}>
                <strong>Route:</strong> {p.startPoint} ➝ {p.endPoint}
              </Typography>
              <Typography sx={{ color: "#ffdca8" }}>
                <strong>Price:</strong> ₹{p.price}
              </Typography>
              <Typography sx={{ color: "#ffdca8" }}>
                <strong>Valid From:</strong>{" "}
                {new Date(p.validFrom).toLocaleDateString()}
              </Typography>
              <Typography sx={{ color: "#ffdca8" }}>
                <strong>Valid Till:</strong>{" "}
                {p.validTill
                  ? new Date(p.validTill).toLocaleDateString()
                  : "-"}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

/* ============================================================
   MAIN PASS PAGE
   ============================================================ */
export default function PassPage() {
  const [tab, setTab] = useState("buy");
  const navigate = useNavigate();

  return (
    <Box
      className="min-h-screen bg-gradient-to-br from-[#1a0a00] to-[#2a1400] relative overflow-hidden"
      sx={{ color: "#fff4e5", fontFamily: "Inter, Roboto" }}
    >
      {/* BG Grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }}
      />

      {/* Header */}
      <Box className="flex items-center justify-between px-6 py-6 relative z-20">
        <Box className="flex items-center gap-4">
          <Avatar src={Zillerlogo} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Ziller
            </Typography>
            <Typography variant="caption" sx={{ color: "#ffc17a" }}>
              Bus Pass Dashboard
            </Typography>
          </Box>
        </Box>

        <Box className="hidden md:flex items-center gap-3">
          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{ color: "#ffe8cc" }}
          >
            Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            sx={{ color: "#ffe8cc", borderColor: "rgba(255,200,150,0.25)" }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box className="flex gap-6 px-6 border-b border-gray-700 pb-2 z-20 relative">
        <Button
          onClick={() => setTab("buy")}
          sx={{
            color: tab === "buy" ? "#ffb347" : "#ffdca8",
            fontWeight: 800,
            borderBottom: tab === "buy" ? "2px solid #ffb347" : "none",
          }}
        >
          Buy Pass
        </Button>

        <Button
          onClick={() => setTab("view")}
          sx={{
            color: tab === "view" ? "#ffb347" : "#ffdca8",
            fontWeight: 800,
            borderBottom: tab === "view" ? "2px solid #ffb347" : "none",
          }}
        >
          View Pass
        </Button>
      </Box>

      {/* Content */}
      <Box className="p-6 relative z-20 max-w-3xl mx-auto">
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,180,0,0.12)",
          }}
        >
          {tab === "buy" ? <BuyPass /> : <ViewPass />}
        </Paper>
      </Box>

      {/* Footer */}
      <Typography
        sx={{ textAlign: "center", py: 4, color: "#804a00" }}
      >
        © {new Date().getFullYear()} Ziller — Design by Senju Kirumada
      </Typography>
    </Box>
  );
}
