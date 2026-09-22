import React, { useState } from 'react';

const AddCashierModal = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    password: '',
    image: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", "Cashier"); // 🔥 important

      // optional: attach bankId from logged-in manager
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.bankId) {
        data.append("bankId", user.bankId);
      }

      if (formData.image) {
        data.append("signatureImage", formData.image); // or signatureImage (depends backend)
      }

      await onSubmit(data);

      setLoading(false);
      onClose();

    } catch (error) {
      console.log("Add cashier error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>

        <div className="modal-logo">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <rect width="60" height="60" rx="12" fill="#3b82f6"/>
            <path d="M30 15 C20 15, 15 25, 20 32 C25 39, 35 39, 40 32 C45 25, 40 15, 30 15" fill="white"/>
          </svg>
        </div>

        <h2>Add Cashier</h2>

        <p className="modal-description">
          Adding Cashier which will do operations in branches and perform day to day operations
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <label className="form-section-title">Cashier Detail</label>

            <input
              type="text"
              name="name"
              placeholder="Cashier Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Cashier Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-section">
            <label className="form-section-title">Credentials</label>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <p className="form-note">
            Please add the cashier who will operate at this branch.
          </p>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "⏳ Adding..." : "⚡ Add Cashier"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddCashierModal;