import React, { useEffect, useState } from 'react';
import { getBranchCustomers, getLogsByBank } from '../api/services';

/* ================= Skeleton ================= */
const SkeletonBox = ({ width, height, borderRadius = 8 }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius
      }}
    />
  );
};

const BranchDetail = ({ branch, onBack }) => {
  const [customers, setCustomers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!branch?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [customerRes, logsRes] = await Promise.all([
          getBranchCustomers(branch._id),
          getLogsByBank(branch._id),
        ]);

        console.log(logsRes.data);
        console.log(customerRes.data);

        setCustomers(customerRes.data || []);
        setLogs(logsRes.data.logs || []);

      } catch (error) {
        console.error("Error fetching branch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [branch?._id]);

  return (
    <div className="main-content" style={{ height: "100vh" }}>

      {/* ================= Header ================= */}
      <div className="branch-detail-header">

        {/* Branch Info */}
        <div className="branch-info-card">

          {loading ? (
            <>
              <SkeletonBox width="60%" height="22px" />
              <div style={{ marginTop: 10 }}>
                <SkeletonBox width="80%" height="14px" />
              </div>
            </>
          ) : (
            <>
              <p className="branch-code">{branch.name}</p>
              <p className="address">{branch.address}</p>
            </>
          )}

        </div>

        {/* Customers Count */}
        <div className="customers-count-card">

          {loading ? (
            <>
              <SkeletonBox width="70%" height="16px" />
              <div style={{ marginTop: 10 }}>
                <SkeletonBox width="40%" height="35px" />
              </div>
              <div style={{ marginTop: 10 }}>
                <SkeletonBox width="80%" height="12px" />
              </div>
            </>
          ) : (
            <>
              <h3>Customers</h3>
              <p className="number">{customers.count}</p>
              <p className="label">Number of Customers</p>
            </>
          )}

        </div>
      </div>

      {/* ================= Logs ================= */}
      <div className="logs-section">

        <h3>Logs</h3>

        {loading ? (

          [1, 2, 3].map((i) => (
            <div key={i} className="log-item">

              {/* Image Skeleton */}
              <SkeletonBox
                width="70px"
                height="70px"
                borderRadius="12px"
              />

              {/* Content Skeleton */}
              <div className="log-info" style={{ flex: 1 }}>

                <div className="log-top">
                  <SkeletonBox width="35%" height="18px" />
                  <SkeletonBox width="80px" height="28px" borderRadius="999px" />
                </div>

                <div style={{ marginTop: 12 }}>
                  <SkeletonBox width="60%" height="12px" />
                </div>

                <div style={{ marginTop: 8 }}>
                  <SkeletonBox width="50%" height="12px" />
                </div>

                <div style={{ marginTop: 8 }}>
                  <SkeletonBox width="40%" height="12px" />
                </div>

                <div style={{ marginTop: 8 }}>
                  <SkeletonBox width="30%" height="12px" />
                </div>

                {/* Bullet Skeleton */}
                <div
                  style={{
                    marginTop: 12,
                    padding: 10,
                    borderRadius: 10,
                    background: "#f9fafb"
                  }}
                >
                  <SkeletonBox width="90%" height="10px" />
                  <div style={{ marginTop: 8 }}>
                    <SkeletonBox width="75%" height="10px" />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <SkeletonBox width="65%" height="10px" />
                  </div>
                </div>

              </div>
            </div>
          ))

        ) : logs.length > 0 ? (

          logs.map((log) => (
            <div key={log._id} className="log-item">

              {/* Signature Image */}
              <img
                src={
                  log.signatureImage ||
                  "https://via.placeholder.com/60"
                }
                alt="signature"
                className="log-avatar"
              />

              {/* Log Info */}
              <div className="log-info">

                {/* Header */}
                <div className="log-top">
                  <h4>
                    {log?.customerId?.name || "Unknown Customer"}
                  </h4>

                  <span
                    className={`status-badge ${
                      log.status === "Verified"
                        ? "verified"
                        : log.status === "Flagged"
                        ? "flagged"
                        : "pending"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>

                {/* Details */}
                <p>
                  <strong>CNIC:</strong>{" "}
                  {log?.customerId?.cnicNumber || "N/A"}
                </p>

                <p>
                  <strong>Cashier:</strong>{" "}
                  {log?.cashierId?.name || "N/A"}
                </p>

                <p>
                  <strong>Document:</strong>{" "}
                  {log?.documentId?.documentName || "N/A"}
                </p>

                <p>
                  <strong>Match:</strong>{" "}
                  {log.matchPercentage}%
                </p>

                {/* Bullet Responses */}
                <div className="bullet-container">
                  {log?.bulletResponse?.map((bullet, index) => (
                    <div key={index} className="bullet-item">
                      • {bullet}
                    </div>
                  ))}
                </div>

                {/* Date */}
                <small className="log-date">
                  {new Date(log.createdAt).toLocaleString()}
                </small>

              </div>
            </div>
          ))

        ) : (
          <p>No logs found</p>
        )}

      </div>
    </div>
  );
};

export default BranchDetail;