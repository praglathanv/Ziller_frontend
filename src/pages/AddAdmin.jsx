// src/pages/AdminPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  Fade,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import "@fontsource/poppins"; // ✅ Poppins font

function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("https://ziller-backend.onrender.com/api/admin/all");
      setAdmins(res.data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  // Add admin
  const handleAddAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("https://ziller-backend.onrender.com/api/admin/register", newAdmin);
      alert("Admin added successfully!");
      setNewAdmin({ username: "", password: "" });
      fetchAdmins();
    } catch (err) {
      console.error("Failed to add admin:", err);
      alert(err.response?.data?.error || "Failed to add admin");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    alert("Delete functionality not implemented yet!");
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
        fontFamily: '"Poppins", sans-serif',
        ...keyframes,
      }}
    >
      {/* Orange grid pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,120,20,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.6,
        }}
      />

      <Fade in appear>
        <Paper
          elevation={12}
          sx={{
            p: 4,
            width: { xs: "90%", sm: "85%", md: "70%" },
            borderRadius: 4,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            backdropFilter: "blur(10px) saturate(120%)",
            border: "1px solid rgba(255,120,0,0.2)",
            boxShadow:
              "0 8px 30px rgba(255,120,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            zIndex: 5,
          }}
        >
          <Box textAlign="center" mb={3}>
            <Avatar
              sx={{
                bgcolor: "#ff7e00",
                width: 70,
                height: 70,
                mb: 2,
                boxShadow: "0 0 30px rgba(255,126,0,0.35)",
                mx: "auto",
              }}
            >
              <GroupIcon fontSize="large" />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "#fff4e5",
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              Admin Management
            </Typography>
            <Typography sx={{ color: "#ffddb0", fontSize: 14 }}>
              Manage your system administrators securely
            </Typography>
          </Box>

          {/* Add Admin Form */}
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            mb={3}
          >
            <TextField
              label="Username"
              name="username"
              value={newAdmin.username}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#ffddb0" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                },
              }}
              sx={{
                width: { xs: "100%", sm: "40%" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,160,60,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,160,60,0.4)" },
                },
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={newAdmin.password}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#ffddb0" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                },
              }}
              sx={{
                width: { xs: "100%", sm: "40%" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,160,60,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,160,60,0.4)" },
                },
              }}
            />

            <Button
              variant="contained"
              disabled={loading}
              sx={{
                px: 4,
                borderRadius: 3,
                fontWeight: 700,
                background: "linear-gradient(90deg, #ffb347, #ff7e00, #ffb347)",
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
              onClick={handleAddAdmin}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Admin"
              )}
            </Button>
          </Box>

          {/* Admin List */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "#ffddb0",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            👥 Admin List
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 3,
              border: "1px solid rgba(255,160,60,0.2)",
              color: "#fff",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#ffddb0" }}>ID</TableCell>
                  <TableCell sx={{ color: "#ffddb0" }}>Username</TableCell>
                  <TableCell sx={{ color: "#ffddb0" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ color: "#fff" }}>
                      No admins found.
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell sx={{ color: "#fff" }}>{admin._id}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>
                        {admin.username}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          sx={{
                            color: "#ff7e00",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                              color: "#ffb347",
                            },
                          }}
                          onClick={() => handleDelete(admin._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            sx={{
              mt: 4,
              fontSize: 12,
              color: "#804a00",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Ziller — Admin Panel by Senju Kirmada
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}

export default AdminPage;
