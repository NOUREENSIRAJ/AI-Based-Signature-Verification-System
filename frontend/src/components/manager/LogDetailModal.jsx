import React from "react";

const LogDetailModal = ({ onClose, log }) => {
  if (!log) return null;
  console.log(log)
  /* =========================
     Status color
  ========================== */
  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#28a745";
      case "Flagged":
        return "#dc3545";
      case "Pending":
        return "#ffc107";
      default:
        return "#000";
    }
  };

  /* =========================
     Date format
  ========================== */
  const formatDateTime = (dateStr) => {
    const dateObj = new Date(dateStr);

    return {
      date: dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const { date, time } = formatDateTime(log.createdAt);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-log"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <h2>Signature Verification Log</h2>

        <p className="modal-description">
          AI-powered signature comparison and verification breakdown.
        </p>

        {/* ================= TOP INFO ================= */}
        <div className="log-detail-content">
          <div className="log-info-row">
            <div className="log-message-box">
              <p className="log-message">
                Document: {log.documentId?.documentName}
              </p>

              <span className="log-cashier">
                Cashier: {log.cashierId?.name}
              </span>

              <span
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: statusColor(log.status),
                }}
              >
                {log.status}
              </span>
            </div>

            <div className="log-date-box">
              <p>Date: {date}</p>
              <p>Time: {time}</p>
            </div>
          </div>

          {/* ================= SIGNATURE SECTION ================= */}
          <div className="signature-section">
            {/* LEFT SIDE */}
            <div className="signature-column">
              <h4>Signature Comparison</h4>

              <div className="signature-images">
                {/* ORIGINAL SIGNATURE (FROM DB / DOC) */}
                <div className="signature-box">
                  <p style={{ fontSize: 12, marginBottom: 5 }}>
                    Uploaded Signature
                  </p>
                  <img
                    src={log.signatureImage}
                    alt="uploaded signature"
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "contain",
                      borderRadius: 8,
                      border: "1px solid #eee",
                    }}
                  />
                </div>

                {/* PLACEHOLDER FOR REFERENCE SIGNATURE */}
                <div className="signature-box">
                  <p style={{ fontSize: 12, marginBottom: 5 }}>
                    Reference Signature
                  </p>
                  <img
                    src={log?.customerId?.signatureImage}
                    alt="uploaded signature"
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "contain",
                      borderRadius: 8,
                      border: "1px solid #eee",
                    }}
                  />
                </div>
              </div>

              {/* MATCH PERCENTAGE */}
              <p className="matching-percentage">
                Matching Percentage:{" "}
                <strong>{log.matchPercentage}%</strong>
              </p>

              {/* AI BULLET RESPONSE */}
              {log.bulletResponse?.length > 0 && (
                <ul
                  style={{
                    fontSize: 13,
                    marginTop: 10,
                    paddingLeft: 18,
                  }}
                >
                  {log.bulletResponse.map((item, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* RIGHT SIDE - CUSTOMER */}
            <div className="customer-column">
              <h4>Customer Detail</h4>

              <div className="customer-detail-box">
                <p>
                  <strong>Name:</strong>{" "}
                  {log.customerId?.name}
                </p>

                <p>
                  <strong>CNIC:</strong>{" "}
                  {log.customerId?.cnicNumber}
                </p>

                <p>
                  <strong>Document:</strong>{" "}
                  {log.documentId?.documentName}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;