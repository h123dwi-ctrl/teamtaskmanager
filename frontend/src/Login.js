import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "Login failed ❌");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
      <h2>Login</h2>
      <label>Email</label>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
        onClick={login}
      >
        Login
      </button>
      <p style={{ marginTop: "16px" }}>
        New user? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
