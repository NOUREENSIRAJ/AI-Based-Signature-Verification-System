import React, { useEffect, useState } from 'react';

import { customerLogin, signIn } from '../../api/services';
import CustomerDashboardLayout from './CustomerDashboardLayout';
import CustomerLogin from './CustomerLogin';
function CustomerApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Auto login check on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(localStorage.getItem("user"))

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user?.role === "customer") {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const handleLogin = async ({ cnicNumber, password }) => {
    try {
      const { data } = await customerLogin({ cnicNumber, password });
      console.log(data)
      const role = data?.user?.role;

      if (role === "customer") {
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
  };

  if (loading) return null; // or loader

  return (
    <>
      {isLoggedIn ? (
        <CustomerDashboardLayout onLogout={handleLogout} />
      ) : (
        <CustomerLogin onLogin={handleLogin} />
      )}

    </>
  );
}

export default CustomerApp;