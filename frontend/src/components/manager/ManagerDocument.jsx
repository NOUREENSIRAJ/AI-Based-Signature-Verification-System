import React, { useEffect, useState } from "react";
import AddDocumentModal from "./AddDocumentModal";
import {
  createDocumentType,
  getDocumentsByBank,
  getBranchCustomers,
  getCashiersByBank,
  getLogsByBank,
} from "../../api/services";

const ManagerDocument = () => {
  const [showModal, setShowModal] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔥 Fetch all dashboard data
  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const bankId = user?.bankId;

    if (!bankId) return;

    try {
      setLoading(true);

      const [
        documentRes,
        customerRes,
        cashierRes,
        logsRes,
      ] = await Promise.all([
        getDocumentsByBank(bankId),
        getBranchCustomers(bankId),
        getCashiersByBank(bankId),
        getLogsByBank(bankId),
      ]);

      console.log("Documents:", documentRes.data);
      console.log("Customers:", customerRes.data);
      console.log("Cashiers:", cashierRes.data);
      console.log("Logs:", logsRes.data);

      setDocuments(documentRes.data || []);
      setCustomers(customerRes.data || []);
      setCashiers(cashierRes.data || []);
      setLogs(logsRes.data || []);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Create new document
  const onSubmit = async (data) => {
    try {
      await createDocumentType(data);
      await fetchData(); // refresh list
      setShowModal(false);
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  useEffect(() => {
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
          <div className="stat-value">{logs.count || 0}</div>
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

      {/* ✅ DOCUMENT LIST */}
      <div className="list-section">
        <div className="section-header">
          <h3>Type of Document {documents?.documents?.length || 0}</h3>
        </div>

        {loading ? (
          <p style={{ padding: "10px" }}>Loading...</p>
        ) : (
          <div className="items-list">
            {documents?.documents?.length > 0 ? (
              documents?.documents?.map((doc, index) => (
                <div
                  key={doc._id || index}
                  className={`list-item document-item ${index === 1 ? "highlighted" : ""
                    }`}
                >
                  {/* ✅ ICON + INFO WRAPPER */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    {/* 📄 Document Icon */}
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "#eef2ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>

                    {/* 📄 TEXT */}
                    <div className="document-info">
                      <span className="document-name">{doc.documentName}</span>
                      <span className="document-category">
                        {doc.documentCategory || "No Category"}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: "10px" }}>No documents found</p>
            )}
          </div>
        )}

        <a
          href="#"
          className="section-link"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          Add New Document →
        </a>
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <AddDocumentModal
          onSubmit={onSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ManagerDocument;