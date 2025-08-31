// src/AdminPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const [admins, setAdmins] = useState([]); // Store list of admins
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" }); // New admin inputs
  const [loading, setLoading] = useState(false);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/all");
      setAdmins(res.data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  // Add new admin via API
  const handleAddAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admin/register", newAdmin);
      alert("Admin added successfully!");
      setNewAdmin({ username: "", password: "" });
      fetchAdmins(); // refresh list
    } catch (err) {
      console.error("Failed to add admin:", err);
      alert(err.response?.data?.error || "Failed to add admin");
    }
    setLoading(false);
  };

  // Delete admin (optional: if you implement API for deletion)
  const handleDelete = async (id) => {
    // Example: await axios.delete(`/api/admin/${id}`);
    alert("Delete functionality not implemented in API yet!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛠️ Admin Management</h1>

      {/* Add Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="username"
          placeholder="Admin Username"
          value={newAdmin.username}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newAdmin.password}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAddAdmin} disabled={loading}>
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </div>

      {/* Admin List */}
      <h2>👥 Admin List</h2>
      {admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin._id}</td>
                <td>{admin.username}</td>
                <td>
                  <button onClick={() => handleDelete(admin._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;
