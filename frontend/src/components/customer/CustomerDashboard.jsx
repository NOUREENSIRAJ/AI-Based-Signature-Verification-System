import "./CustomerDashboard.css";
import React, { useEffect, useState } from 'react';
// Import the new service
import { getCustomerDashboard } from '../../api/services';

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const customerId = user?.id; // Using the ID of the logged-in customer

    if (!customerId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Call the new specific dashboard endpoint
        const response = await getCustomerDashboard(customerId);
        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Skeleton Loaders remain the same ---
  const SkeletonCard = () => (
    <div className="stat-card skeleton-card">
      <div className="skeleton title"></div>
      <div className="skeleton number"></div>
      <div className="skeleton text"></div>
    </div>
  );

  if (loading || !dashboardData) {
    return (
      <div className="manager-dashboard">
        <div className="stats-row">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="dashboard-content" style={{gridTemplateColumns:"none"}}>
          <div className="growth-section" style={{ width: '100%' }}>
            <div className="skeleton chart" style={{ height: '300px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from the controller response
  const { summary, authorizations, customerName } = dashboardData;
  console.log(authorizations)
  // Process data for the Growth Chart (using Authorizations over time)
  const monthlyData = {};
  authorizations.forEach((auth) => {
    const date = new Date(auth.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  const chartValues = Object.values(monthlyData);
  const maxVal = Math.max(...chartValues, 1);
  const points = chartValues.length > 1
    ? chartValues.map((val, i) => {
      const x = (i / (chartValues.length - 1)) * 400;
      const y = 120 - (val / maxVal) * 100;
      return `${x},${y}`;
    }).join(" ")
    : "0,120 400,120"; // Fallback line if only one data point

  return (
    <div className="manager-dashboard">
      <h2 className="welcome-text" style={{ color: "white" }}>Welcome back, {customerName}</h2>

      {/* Stats Cards using the Summary object from Controller */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Logs</h3>
          <div className="stat-value">{summary.totalLogs}</div>
          <p>Activity history count</p>
        </div>

        <div className="stat-card">
          <h3>Authorizations</h3>
          <div className="stat-value">{summary.totalAuthorizations}</div>
          <p>Total requests made</p>
        </div>

        <div className="stat-card">
          <h3>Document Types</h3>
          <div className="stat-value">
            {Object.keys(summary.documentBreakdown).length}
          </div>
          <p>Different types verified</p>
        </div>
      </div>

      <div className="dashboard-content" style={{ gridTemplateColumns: "none" }}>
        {/* Authorizations List (Replacing Cashiers List) */}
        <div className="cashiers-section">
          <div className="section-header">
            <h3>Recent Authorizations</h3>
          </div>

          <div className="cashiers-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {authorizations.length > 0 ? (
              authorizations.map((auth) => (
                <div
                  key={auth._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    border: '1px solid #f0f0f0',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* LEFT: ICON & MAIN INFO */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Circular Icon Placeholder */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      📄
                    </div>

                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                        {auth.recipientName || "Unnamed Recipient"}
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#888' }}>
                        Slip #{auth.slipId} • {new Date(auth.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: STATUS BADGE */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      backgroundColor: auth.status === 'active' ? '#E8F5E9' : '#F5F5F5',
                      color: auth.status === 'active' ? '#2E7D32' : '#757575',
                    }}>
                      {auth.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <p>No authorizations found.</p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default CustomerDashboard;