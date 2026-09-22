import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { signIn } from "../../api/services";

const ManagerLogin = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await onLogin({ email, password });

    if (res?.error) {
      setError(res.error);
    }

    setLoading(false);
  };
  
  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>Match Signature</h1>
        <p>Signature Matching System For Secure Banking</p>

        <div className="admin-badge">
          <ShieldCheck size={18} /> Manager Portal
        </div>

        <button className="read-more-btn">Read More</button>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <h2>Manager Login</h2>
        <p className="subtitle">
          Only Authorized Manager Can Login From Here
        </p>

        {/* ✅ Error UI */}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <Mail size={18} style={{
              position: "relative",
              left: 37
            }} />
            <input
              type="email"
              placeholder="Cashier Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <Lock size={18} style={{
              position: "relative",
              left: 37
            }} />
            <input
              type="password"
              placeholder="Cashier Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`login-btn manager-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Sign in as Manager"}
          </button>
        </form>

        <p className="forgot-password">
          Forgot Manager Password?
        </p>
      </div>
    </div>
  );
};

export default ManagerLogin;