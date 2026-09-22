import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { AdminDashboard, getAllCustomers } from "../api/services";

/* ================= Skeleton Component ================= */
const SkeletonBox = ({ width, height, borderRadius = 8 }) => {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius }}
    />
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    banks: 0,
    cashiers: 0,
    customers: 0,
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Analytics ================= */
  const getAnalytics = (customers) => {
    if (!customers || customers.length === 0) {
      return {
        topMonth: "N/A",
        topYear: "N/A",
        topYearCount: 0,
        growth: 0,
      };
    }

    const monthCounts = Array(12).fill(0);
    const yearCounts = {};

    customers.forEach((c) => {
      if (!c.createdAt) return;

      const date = new Date(c.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();

      monthCounts[month]++;
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const maxMonthIndex = monthCounts.indexOf(Math.max(...monthCounts));
    const topMonth = monthNames[maxMonthIndex];

    const topYear = Object.keys(yearCounts)[0] || "N/A";
    const topYearCount = yearCounts[topYear] || 0;

    const currentMonth = new Date().getMonth();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentValue = monthCounts[currentMonth];
    const prevValue = monthCounts[prevMonth];

    let growth = 0;
    if (prevValue === 0) {
      growth = currentValue > 0 ? 100 : 0;
    } else {
      growth = ((currentValue - prevValue) / prevValue) * 100;
    }

    return {
      topMonth,
      topYear,
      topYearCount,
      growth: growth.toFixed(1),
    };
  };

  const analytics = getAnalytics(customers);

  /* ================= Fetch Data ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const statsRes = await AdminDashboard();
        setStats(statsRes.data.data);

        console.log("stats for mediium",statsRes.data.data)
        const customerRes = await getAllCustomers();
        setCustomers(customerRes.data.customers);

      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= Chart ================= */
  const getMonthlyData = (customers) => {
    const months = Array(12).fill(0);

    customers.forEach((c) => {
      if (!c.createdAt) return;

      const date = new Date(c.createdAt);
      const month = date.getMonth();
      months[month]++;
    });

    return months;
  };

  const generatePath = (data) => {
    const max = Math.max(...data, 1);
    const stepX = 400 / (data.length - 1);

    return data
      .map((value, i) => {
        const x = i * stepX;
        const y = 120 - (value / max) * 100;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const monthlyData = getMonthlyData(customers);
  const linePath = generatePath(monthlyData);
  const areaPath = `${linePath} L 400 150 L 0 150 Z`;

  /* ================= UI ================= */
  return (
    <div className="main-content">

      {/* ================= Stats ================= */}
      <div className="stats-grid">

        {loading
          ? [1, 2, 3].map((i) => (
              <div className="stat-card" key={i}>
                <SkeletonBox width="60%" height="18px" />
                <SkeletonBox width="40%" height="30px" />
                <SkeletonBox width="80%" height="12px" />
              </div>
            ))
          : (
            <>
              <div className="stat-card">
                <h3>Branches</h3>
                <p className="number">{stats.banks}</p>
              </div>

              <div className="stat-card">
                <h3>Cashier</h3>
                <p className="number">{stats.cashiers}</p>
              </div>

              <div className="stat-card">
                <h3>Customers</h3>
                <p className="number">{stats.customers}</p>
              </div>
            </>
          )
        }

      </div>

      {/* ================= Bottom ================= */}
      <div className="dashboard-grid">

        {/* Customers */}
        <div className="customers-section">
          <h3>Customers</h3>

          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div className="customer-item" key={i}>
                  <SkeletonBox width="40px" height="40px" borderRadius="50%" />
                  <div style={{ marginLeft: 10, flex: 1 }}>
                    <SkeletonBox width="70%" height="12px" />
                    <SkeletonBox width="50%" height="10px" />
                  </div>
                </div>
              ))
            : customers.slice(0, 4).map((customer) => (
                <div key={customer._id} className="customer-item">
                  <img
                    src={customer.profilePicture || "https://via.placeholder.com/40"}
                    className="customer-avatar"
                    alt=""
                  />
                  <div className="customer-info">
                    <h4>{customer.name}</h4>
                    <p>{customer.cnicNumber || "No Branch"}</p>
                  </div>
                </div>
              ))
          }

        </div>

        {/* ================= Growth Chart ================= */}
        <div className="growth-section">

          <h3>Growth</h3>

          {loading ? (
            <SkeletonBox width="100%" height="150px" />
          ) : (
            <div className="chart-placeholder">
              <svg viewBox="0 0 400 150" style={{ width: "100%", height: "220px" }}>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(76, 175, 80, 0.3)" />
                    <stop offset="100%" stopColor="rgba(76, 175, 80, 0.05)" />
                  </linearGradient>
                </defs>

                <path d={areaPath} fill="url(#gradient)" />

                <path
                  d={linePath}
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* Stats Row */}
          <div className="stats-row">

            {loading
              ? [1, 2, 3].map((i) => (
                  <div className="stat-box" key={i}>
                    <SkeletonBox width="70%" height="12px" />
                    <SkeletonBox width="50%" height="18px" />
                  </div>
                ))
              : (
                <>
                  <div className="stat-box">
                    <h4>Top month</h4>
                    <p className="value">{analytics.topMonth}</p>
                  </div>

                  <div className="stat-box">
                    <h4>Top year</h4>
                    <p className="year">{analytics.topYear}</p>
                  </div>

                  <div className="stat-box">
                    <h4>Growth</h4>
                    <p className="year">
                      {analytics.growth > 0 ? "+" : ""}
                      {analytics.growth}%
                    </p>
                  </div>
                </>
              )
            }

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;