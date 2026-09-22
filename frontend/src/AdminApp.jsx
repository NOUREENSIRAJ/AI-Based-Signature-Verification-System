import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import { signIn } from "./api/services";

function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Auto login check on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(localStorage.getItem("user"))

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user?.role === "Admin") {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const handleLogin = async ({ email, password }) => {
    try {
      const { data } = await signIn({ email, password });

      const role = data?.user?.role;

      if (role === "Admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { error: "Access denied. Admins only." };
      }

    } catch (err) {
      return { error: "Invalid email or password" };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  if (loading) return null; // or loader

  return (
    <>
      {isLoggedIn ? (
        <DashboardLayout onLogout={handleLogout} />
      ) : (
        <></>
      )}
    </>
  );
}

export default AdminApp;

