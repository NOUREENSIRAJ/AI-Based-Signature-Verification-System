import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { signIn } from "../api/services";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (onLogin) {
        const res = await onLogin({ email, password });

        // handle error from parent
        if (res?.error) {
          setError(res.error);
        }
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>Match Signature</h1>
        <p>Signature Matching System For Secure Banking</p>

        <div className="admin-badge">
          🔐 Admin Portal
        </div>

        <button className="read-more-btn">Read More</button>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <h2>Admin Login</h2>

        <p className="subtitle">
          Only Authorized Admin Can Login From Here
        </p>

        {/* ✅ Error Message */}
        {error && (
          <p
            style={{
              background: "#760c0c",
              color: "white",
              justifyContent: "center",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center",
            }}
            className="error-text"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">✉</span>

            <input
              type="email"
              placeholder="Admin Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>

            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;