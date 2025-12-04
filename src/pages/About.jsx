import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Fade,
  Divider,
  Button,
} from "@mui/material";

export default function AboutMUI() {
  const navigate = useNavigate();

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
          justifyContent: "space-between",
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
          About Us
        </Typography>

        <Button
          onClick={() => navigate(-1)}
          sx={{
            background: "linear-gradient(90deg,#ffb347,#ff7e00)",
            color: "#1a0a00",
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            "&:hover": { transform: "translateY(-3px)" },
          }}
        >
          Back
        </Button>
      </Box>

      {/* Main Content Card */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4, md: 8 },
          position: "relative",
          zIndex: 6,
        }}
      >
        <Fade in appear>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 3, sm: 4 },
              width: { xs: "92%", sm: "700px" },
              borderRadius: 4,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              backdropFilter: "blur(12px) saturate(140%)",
              border: "1px solid rgba(255,120,0,0.18)",
              color: "#fff4e5",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: 30,
                textAlign: "center",
                mb: 3,
                color: "#ffb347",
              }}
            >
              Who We Are
            </Typography>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mb: 2 }} />

            <Typography sx={{ lineHeight: 1.7, mb: 3 }}>
              We built this app to make everyday bus travel{" "}
              <span style={{ color: "#ff7e00", fontWeight: 600 }}>
                hassle-free
              </span>
              .  
              Many passengers struggle with loose change — ₹2, ₹3 — every day.
              We created a smooth, modern solution to pay digitally and ride
              peacefully.
            </Typography>

            <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
              With our app, you can:
            </Typography>

            <Box component="ul" sx={{ pl: 3, lineHeight: 1.8 }}>
              <li>Find your bus and choose destinations easily.</li>
              <li>Pay digitally — no more worrying about change.</li>
              <li>Get a digital ticket instantly.</li>
            </Box>

            <Typography sx={{ mt: 3, lineHeight: 1.7 }}>
              Whether you're a student, worker, or traveler, our goal is to make
              your daily ride smoother, faster, and completely{" "}
              <span style={{ color: "#ff7e00", fontWeight: 600 }}>
                stress-free.
              </span>
            </Typography>

            <Typography
              sx={{
                textAlign: "center",
                mt: 4,
                fontWeight: 700,
                color: "#ffb347",
                fontSize: 20,
              }}
            >
              Travel Smart. Travel Simple. Travel with Us.
            </Typography>
          </Paper>
        </Fade>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: "center", zIndex: 6 }}>
        <Typography sx={{ color: "#804a00", fontSize: 13 }}>
          © {new Date().getFullYear()} Ziller — Design by Senju Kirumada
        </Typography>
      </Box>
    </Box>
  );
}
