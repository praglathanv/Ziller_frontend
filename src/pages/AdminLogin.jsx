// src/pages/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Fade,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://ziller-backend.onrender.com/api/admin/login", {
        username,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("adminToken", token);

      const adminRes = await axios.get("https://ziller-backend.onrender.com/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("adminData", JSON.stringify(adminRes.data));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Login failed");
    }
    setLoading(false);
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(120deg, #0a0602, #1c0b00, #2b1200, #1c0b00, #0a0602)",
        backgroundSize: "200% 200%",
        animation: "moveGradient 18s ease-in-out infinite",
        ...keyframes,
      }}
    >
      {/* Glowing pattern overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,120,20,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.6,
        }}
      />

      <Fade in appear>
        <Paper
          elevation={12}
          sx={{
            p: 4,
            width: { xs: "85%", sm: 380 },
            borderRadius: 4,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            backdropFilter: "blur(10px) saturate(120%)",
            border: "1px solid rgba(255,120,0,0.2)",
            boxShadow:
              "0 8px 30px rgba(255,120,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#ff7e00",
              width: 70,
              height: 70,
              mb: 2,
              boxShadow: "0 0 30px rgba(255,126,0,0.35)",
            }}
          >
            <LockIcon fontSize="large" />
          </Avatar>

          <Typography
            variant="h5"
            sx={{
              mb: 1,
              fontWeight: 900,
              color: "#fff4e5",
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Admin Login
          </Typography>
          <Typography sx={{ mb: 3, color: "#ffddb0", fontSize: 14 }}>
            Authorized access only
          </Typography>

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ style: { color: "#ffddb0" } }}
            InputProps={{
              style: {
                color: "#fff",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,160,60,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,160,60,0.4)" },
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#ffddb0" } }}
            InputProps={{
              style: {
                color: "#fff",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,160,60,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,160,60,0.4)" },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: 3,
              fontWeight: 700,
              background:
                "linear-gradient(90deg, #ffb347, #ff7e00, #ffb347)",
              backgroundSize: "200%",
              color: "#1a0a00",
              boxShadow: "0 10px 25px rgba(255,126,0,0.25)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundPosition: "right center",
                transform: "translateY(-3px)",
                boxShadow: "0 20px 45px rgba(255,126,0,0.35)",
              },
            }}
            onClick={handleLogin}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography
            sx={{
              mt: 4,
              fontSize: 12,
              color: "#804a00",
            }}
          >
            © {new Date().getFullYear()} Ziller — Admin Panel by Senju Kirmada
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}

export default AdminLogin;
