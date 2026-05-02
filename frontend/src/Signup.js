import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const signup = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      await axios.post(`${API_URL}/signup`, { name, email, password, role });
      setMessage("Account created. Please login.");
      setError("");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed.");
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "0 auto", textAlign: "left" }}>
      <h2>Signup</h2>
      <label>Name</label>
      <input
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label style={{ marginTop: "16px", display: "block" }}>Email</label>
      <input
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label style={{ marginTop: "16px", display: "block" }}>Password</label>
      <input
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <label style={{ marginTop: "16px", display: "block" }}>Role</label>
      <select
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }} onClick={signup}>Signup</button>
      <p style={{ marginTop: "16px" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
