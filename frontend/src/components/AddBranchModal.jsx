import React, { useState, useEffect } from 'react';
import { getAllManagers } from "../api/services";

const AddBranchModal = ({ onClose, onSubmit }) => {
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // ✅ NEW: submit loading state
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    managerId: ''
  });

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoadingManagers(true);
        const res = await getAllManagers();
        setManagers(res?.data?.managers || []);
      } catch (error) {
        console.log("Error fetching managers:", error);
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Submit with loading
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await onSubmit({
        name: formData.name,
        address: formData.address,
        managerId: formData.managerId
      });

      // optional: close modal after success
      onClose();

    } catch (error) {
      console.log("Error submitting branch:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="modal-icon">
          <span style={{ color: 'white', fontSize: '28px' }}>🐉</span>
        </div>

        <h2>Add Branch</h2>

        <p className="description">
          Adding the Branch also assigns a Manager for that Branch
        </p>

        <form onSubmit={handleSubmit}>

          <label className="form-label">Branch Detail</label>

          <input
            type="text"
            name="name"
            placeholder="Branch Name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Branch Address"
            className="form-input"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <label className="form-label">Select Manager</label>

          <select
            name="managerId"
            className="form-select"
            value={formData.managerId}
            onChange={handleChange}
            required
            disabled={loadingManagers || submitting}
          >
            <option value="">
              {loadingManagers ? "Loading managers..." : "Select a manager"}
            </option>

            {!loadingManagers &&
              managers.map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.name}
                </option>
              ))}
          </select>

          <p className="form-note">
            Please choose the manager who will operate this branch.
          </p>

          {/* ✅ Submit Button with Loading */}
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="icon">⏳</span>
                Adding Branch...
              </>
            ) : (
              <>
                <span className="icon">⚡</span>
                Add Branch
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddBranchModal;