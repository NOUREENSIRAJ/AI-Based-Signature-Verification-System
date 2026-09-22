import React, { useState } from 'react';

const AddManagerModal = ({ onClose, onSubmit }) => {
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

    setLoading(true); // ✅ start loading

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", "Manager");

      if (formData.image) {
        data.append("signatureImage", formData.image);
      }

      await onSubmit(data); // wait for API

      setLoading(false);
      onClose(); // close modal after success

    } catch (error) {
      console.log(error);
      setLoading(false); // stop loading on error
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="modal-icon">
          <span style={{ color: 'white', fontSize: '28px' }}>🐉</span>
        </div>

        <h2>Add Manager</h2>

        <p className="description">
          Adding Managers which will control branches and oversee day to day operations
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Manager Name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Manager Address"
            className="form-input"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            className="form-input"
            onChange={handleFileChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <p className="form-note">
            Please add the manager who will operate this branch.
          </p>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                ⏳ Adding...
              </>
            ) : (
              <>
                ⚡ Add Manager
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddManagerModal;