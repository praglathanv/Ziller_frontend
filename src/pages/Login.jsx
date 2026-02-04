// src/pages/Login.js
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
import LockOpenIcon from "@mui/icons-material/LockOpen";

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://ziller-backend.onrender.com/api/auth/login",
        {
          name: formData.name,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(120deg, #1a0a00 0%, #2b1200 25%, #3a1700 50%, #2b1200 75%, #1a0a00 100%)",
        backgroundSize: "200% 200%",
        animation: "moveGradient 18s ease-in-out infinite",
        ...keyframes,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />

      <Fade in appear>
        <Paper
          elevation={10}
          sx={{
            position: "relative",
            p: 4,
            width: { xs: "85%", sm: 380 },
            borderRadius: 4,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            backdropFilter: "blur(8px) saturate(120%)",
            border: "1px solid rgba(255,145,0,0.15)",
            boxShadow:
              "0 10px 40px rgba(255,120,20,0.1), inset 0 1px 0 rgba(255,255,255,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#ff7e00",
              width: 64,
              height: 64,
              mb: 2,
              boxShadow: "0 0 25px rgba(255,126,0,0.35)",
            }}
          >
            <LockOpenIcon fontSize="large" />
          </Avatar>

          <Typography
            variant="h5"
            sx={{
              mb: 1,
              fontWeight: 900,
              color: "#fff4e5",
              letterSpacing: 0.5,
            }}
          >
            Welcome Back
          </Typography>

          <Typography sx={{ mb: 3, color: "#ffddb0", fontSize: 14 }}>
            Login to continue your journey
          </Typography>

          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#ffddb0" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#ffddb0" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 3,
                fontWeight: 700,
                letterSpacing: 0.5,
                background:
                  "linear-gradient(90deg,#ffb347,#ff7e00,#ffb347)",
                backgroundSize: "200%",
                color: "#1a0a00",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <Typography sx={{ mt: 3, color: "#ffddb0" }}>
            Don’t have an account?{" "}
            <span
              style={{
                color: "#ff7e00",
                cursor: "pointer",
                fontWeight: 700,
              }}
              onClick={() => navigate("/signup")}
            >
              Signup
            </span>
          </Typography>

          <Typography sx={{ mt: 4, fontSize: 12, color: "#804a00" }}>
            © {new Date().getFullYear()} Ziller — Design by Senju Kirmada
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}

export default Login;
