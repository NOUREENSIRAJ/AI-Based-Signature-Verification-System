import "./ManagerDashboard.css";
import React, { useEffect, useState } from 'react';
import {
  getCashiersByBank,
  getBranchCustomers,
  getLogsByBank
} from '../../api/services';
import ManagerGrowthChart from "./ManagerGrowthChart";

const ManagerDashboard = () => {
  const [cashiers, setCashiers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    console.log(user)
    const bankId = user?.bankId;

    if (!bankId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [cashierRes, customerRes, logsRes] = await Promise.all([
          getCashiersByBank(bankId),
          getBranchCustomers(bankId),
          getLogsByBank(bankId)
        ]);
        console.log(cashierRes.data)
        console.log(customerRes.data)
        console.log(logsRes.data)

        setCashiers(cashierRes.data || []);
        setCustomers(customerRes.data || []);
        setLogs(logsRes.data || []);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SkeletonCard = () => (
    <div className="stat-card skeleton-card">
      <div className="skeleton title"></div>
      <div className="skeleton number"></div>
      <div className="skeleton text"></div>
    </div>
  );

  const SkeletonCashier = () => (
    <div className="cashier-item skeleton-item">
      <div className="skeleton avatar"></div>
      <div className="skeleton line"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="manager-dashboard">

        {/* Stats skeleton */}
        <div className="stats-row">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Content skeleton */}
        <div className="dashboard-content">

          {/* Cashiers skeleton */}
          <div className="cashiers-section">
            <div className="section-header">
              <div className="skeleton title small"></div>
            </div>

            <div className="cashiers-list">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCashier key={i} />
              ))}
            </div>
          </div>

          {/* Chart skeleton */}
          <div className="growth-section">
            <div className="skeleton chart"></div>

            <div className="growth-stats">
              <div className="skeleton text"></div>
              <div className="skeleton text"></div>
              <div className="skeleton text"></div>
            </div>
          </div>

        </div>
      </div>
    );
  }
  // 🔥 Process logs
  const monthlyData = {};
  const yearlyData = {};
  const customerActivity = {};

  logs?.logs?.forEach((log) => {
    const date = new Date(log.createdAt);

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const yearKey = date.getFullYear();

    // Count monthly
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;

    // Count yearly
    yearlyData[yearKey] = (yearlyData[yearKey] || 0) + 1;

    // Count customer activity
    const customerName = log.customerName || "Unknown";
    customerActivity[customerName] =
      (customerActivity[customerName] || 0) + 1;
  });

  const topMonth = Object.entries(monthlyData).sort((a, b) => b[1] - a[1])[0];
  const topYear = Object.entries(yearlyData).sort((a, b) => b[1] - a[1])[0];
  const topCustomer = Object.entries(customerActivity).sort((a, b) => b[1] - a[1])[0];

  const chartValues = Object.values(monthlyData);

  // Normalize values for SVG height
  const maxVal = Math.max(...chartValues, 1);

  const points = chartValues.map((val, i) => {
    const x = (i / (chartValues.length - 1 || 1)) * 400;
    const y = 120 - (val / maxVal) * 100;
    return `${x},${y}`;
  }).join(" ");





  return (
    <div className="manager-dashboard">

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>Activity</h3>
          <div className="stat-value">{logs.count}</div>
          <p>Number Of Activities</p>
        </div>

        <div className="stat-card">
          <h3>Cashier</h3>
          <div className="stat-value">{cashiers.count}</div>
          <p>Number of Cashier</p>
        </div>

        <div className="stat-card">
          <h3>Customers</h3>
          <div className="stat-value">{customers.count}</div>
          <p>Number of Customers</p>
        </div>
      </div>

      <div className="dashboard-content">

        {/* Cashiers Section */}
        <div className="cashiers-section">
          <div className="section-header">
            <h3>Cashiers</h3>
            <span className="collapse-icon">∨</span>
          </div>

          <div className="cashiers-list">
            {cashiers?.cashiers?.map((cashier, index) => (
              <div key={cashier._id} className={`cashier-item`}>
                <img
                  src={cashier.image || `https://i.pravatar.cc/40?u=${cashier._id}`}
                  alt={cashier.name}
                  className="cashier-avatar"
                />
                <span className="cashier-name">{cashier.name}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Growth Section (keep static for now) */}
        <div className="growth-section">
          <ManagerGrowthChart logs={logs} />


          <div className="growth-stats">
            <div className="growth-stat">
              <span className="stat-label">Top month</span>
              <span className="stat-main">
                {topMonth ? new Date(topMonth[0]).toLocaleString('default', { month: 'long' }) : "N/A"}
              </span>
              <span className="stat-sub">
                {topMonth ? topMonth[1] + " activities" : ""}
              </span>
            </div>

            <div className="growth-stat">
              <span className="stat-label">Top year</span>
              <span className="stat-main">{topYear?.[0] || "N/A"}</span>
              <span className="stat-sub">
                {topYear ? `${topYear[1]} Times Used` : ""}
              </span>
            </div>

            <div className="growth-stat">
              <span className="stat-label">Top Customer</span>
              <div className="top-customer">
                <img src="https://i.pravatar.cc/30" alt="Top Customer" />
                <span>{topCustomer?.[0] || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;