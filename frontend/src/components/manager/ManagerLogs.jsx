import "./ManagerCashier.css";
import React, { useEffect, useState } from "react";
import LogDetailModal from "./LogDetailModal";
import {
  getLogsByBank,
  getCashiersByBank,
  getBranchCustomers,
} from "../../api/services";

const ManagerLogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [logs, setLogs] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA (same pattern as ManagerDocument)
  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const bankId = user?.bankId;

    if (!bankId) return;

    try {
      setLoading(true);

      const [logsRes, cashierRes, customerRes] = await Promise.all([
        getLogsByBank(bankId),
        getCashiersByBank(bankId),
        getBranchCustomers(bankId),
      ]);

      console.log("Logs:", logsRes.data);

      setLogs(logsRes.data || []);
      setCashiers(cashierRes.data || []);
      setCustomers(customerRes.data || []);

    } catch (err) {
      console.error("Logs fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };


  const SkeletonCard = () => (
    <div className="stat-card skeleton-card">
      <div className="skeleton title"></div>
      <div className="skeleton number"></div>
      <div className="skeleton text"></div>
    </div>
  );

  const SkeletonCashier = () => (
    <div className="list-item skeleton-item">
      <div className="skeleton avatar"></div>

      <div style={{ flex: 1 }}>
        <div className="skeleton line short"></div>
        <div className="skeleton line long"></div>
      </div>
    </div>
  );

  const SkeletonHeader = () => (
    <div className="section-header">
      <div className="skeleton title small"></div>
    </div>
  );
  const buildLogMessage = (log) => {
    const docName = log?.documentId?.documentName || "a document";
    const customer = log?.customerId?.name || "a customer";
    const cashier = log?.cashierId?.name || "Unknown cashier";
    const match = log?.matchPercentage;

    let statusText = "";

    if (log.status === "Flagged") {
      statusText = "⚠️ flagged as suspicious";
    } else if (log.status === "Approved") {
      statusText = "✅ verified successfully";
    } else {
      statusText = `processed with status ${log.status}`;
    }

    return `${cashier} processed ${docName} for ${customer} and it was ${statusText} (Match: ${match}%)`;
  };

  const formatDateTime = (updatedAt) => {
    if (!updatedAt) return { date: "N/A", time: "N/A" };

    const dateObj = new Date(updatedAt);

    const date = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { date, time };
  };
  if (loading) {
    return (
      <div className="manager-dashboard">

        {/* Stats */}
        <div className="stats-row">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Cashier Section */}
        <div className="list-section">

          <SkeletonHeader />

          <div className="items-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCashier key={i} />
            ))}
          </div>

        </div>

      </div>
    );
  }
  return (
    <div className="manager-dashboard">

      {/* ✅ STATS (Dynamic) */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>Activity</h3>
          <div className="stat-value">{logs?.count || 0}</div>
          <p>Number Of Activities</p>
        </div>

        <div className="stat-card">
          <h3>Cashier</h3>
          <div className="stat-value">
            {cashiers?.cashiers?.length || 0}
          </div>
          <p>Number of Cashier</p>
        </div>

        <div className="stat-card">
          <h3>Customers</h3>
          <div className="stat-value">
            {customers?.customers?.length || 0}
          </div>
          <p>Number of Customers</p>
        </div>
      </div>

      {/* ✅ LOG LIST */}
      <div className="list-section">
        <div className="section-header">
          <h3>Detailed Logs [{logs?.count || 0}]</h3>
        </div>

        {loading ? (
          <p style={{ padding: "10px" }}>Loading...</p>
        ) : (
          <div className="logs-list">
            {logs?.logs.length > 0 ? (
              logs.logs.map((log, index) => (
                <div
                  key={log._id || index}
                  className={`log-item ${log.type || "default"}`}
                  onClick={() => handleLogClick(log)}
                  style={{
                    cursor: "pointer"
                  }}
                >
                  <div className="log-content">

                    {/* ✅ MESSAGE */}
                    <p className="log-message">
                      {buildLogMessage(log)}
                    </p>

                    {/* ✅ CASHIER + META */}
                    <div style={{ display: "flex", flexDirection: "column", fontSize: "12px", opacity: 0.7 }}>
                      <span>
                        {(() => {
                          const { date, time } = formatDateTime(log.updatedAt);
                          return (
                            <>
                              {date} • {time}
                            </>
                          );
                        })()}                      </span>
                    </div>

                  </div>

                  <span className="more-icon">⋮</span>
                </div>
              ))
            ) : (
              <p style={{ padding: "10px" }}>No logs found</p>
            )}
          </div>
        )}
      </div>

      {/* ✅ MODAL */}
      {showModal && selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ManagerLogs;