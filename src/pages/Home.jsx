import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import homeBanner from "../assets/images/home_banner.png";
import { IoLocationSharp } from "react-icons/io5";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setAdmins([]);
      return;
    }

    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filtered = res.data.filter(
          (admin) =>
            admin.currentSession === true &&
            admin.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setAdmins(filtered);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      }
    };

    fetchAdmins();
  }, [searchQuery]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100dvh",
        px: 2,
        overflow: "hidden",
        background: "radial-gradient(circle at bottom right, orange 1%, white 60%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <Box display="flex" alignItems="center" mt={1} mb={2}>
        <Typography
          variant="h3"
          sx={{
            flex: 1,
            color:"white",
            fontWeight: "bold",
            fontFamily: "serif",
            textShadow: "0 0 10px rgb(249,115,22)",
          }}
        >
          Ziller
        </Typography>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 1,
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Button onClick={() => navigate("/tickets")}>History</Button>
          <Button onClick={() => navigate("/take-pass")}>Take Pass</Button>
          <Button onClick={() => navigate("/about")}>About Us</Button>
          <Button onClick={() => navigate("/admin")}>Admin</Button>
          <Button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Search Bar + Actions */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search the bus you travelling..."
          variant="outlined"
          sx={{
            flex: 1,
            mx: { md: 2 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              border: "3px solid rgba(0,0,0,0.4)",
            },
            "& .MuiOutlinedInput-input::placeholder": {
              fontSize: "1.1rem",
              color: "gray",
            },
          }}
        />

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            ml: 2,
            fontSize: "2.5rem",
            color: "orange",
          }}
        >
          <IoLocationSharp />
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          onClick={() => setMenuOpen(true)}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Center Section */}
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
      >
        <Box display={{ xs: "none", md: "flex" }} flexDirection="column" gap={2}>
          {["No more", "regret for", "the change"].map((text, i) => (
            <Typography
              key={i}
              variant="h3"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(to right, orange, gold)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>

        {/* Mobile text */}
        <Box display={{ xs: "flex", md: "none" }} flexDirection="column" gap={1}>
          {["No more", "regret", "for the", "change"].map((text, i) => (
            <Typography
              key={i}
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(to right, orange, gold)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>

        {/* Banner Image */}
        <Box flex={1} display="flex" justifyContent="center">
          <Box
            component="img"
            src={homeBanner}
            alt="banner"
            sx={{
              maxHeight: "100%",
              objectFit: "contain",
              display: { xs: "block", md: "block" },
            }}
          />
        </Box>
      </Box>

      {/* Search Results */}
      {searchQuery && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "9.2rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "90%", md: "50%" },
            p: 2,
            borderRadius: 2,
            zIndex: 20,
          }}
        >
          {admins.length > 0 ? (
            admins.map((admin) => (
              <Box
                key={admin._id}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "grey.100" },
                  fontWeight: "bold",
                }}
                onClick={() =>
                  navigate(`/bus/${admin._id}`, {
                    state: { id: admin._id, name: admin.username },
                  })
                }
              >
                🚌 {admin.username}
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">No admins found</Typography>
          )}
        </Paper>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{ sx: { width: "75%" } }}
      >
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
              setMenuOpen(false);
              localStorage.clear();
              navigate("/login");
            }}
          >
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default Home;
