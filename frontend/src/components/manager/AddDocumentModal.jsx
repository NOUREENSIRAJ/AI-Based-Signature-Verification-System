import React, { useState } from "react";

const AddDocumentModal = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    documentName: "",
    documentCategory: ""
  });

  const categoryOptions = [
    "Transactional",
    "Legal",
    "Identity",
    "Loan",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const payload = {
      documentName: formData.documentName,
      documentCategory: formData.documentCategory,
      bankId: user?.bankId
    };

    try {
      setLoading(true);

      // ✅ SEND TO PARENT
      await onSubmit(payload);

      // optional: reset form
      setFormData({
        documentName: "",
        documentCategory: ""
      });

    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-small"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-logo">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <rect width="60" height="60" rx="12" fill="#3b82f6" />
            <path d="M30 15 C20 15, 15 25, 20 32 C25 39, 35 39, 40 32 C45 25, 40 15, 30 15" fill="white" />
            <path d="M25 28 Q30 35, 35 28" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <h2>Add New Document Type</h2>
        <p className="modal-description">
          Add new document type for processing.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="form-section-title">Document Details</label>

            {/* Name */}
            <input
              type="text"
              placeholder="Document Name"
              value={formData.documentName}
              onChange={(e) =>
                setFormData({ ...formData, documentName: e.target.value })
              }
              required
            />

            {/* ✅ Dropdown */}
            <select
              value={formData.documentCategory}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  documentCategory: e.target.value
                })
              }
              required
              style={{
                marginTop: "10px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%"
              }}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Adding..." : "⚡ Add Document"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal;