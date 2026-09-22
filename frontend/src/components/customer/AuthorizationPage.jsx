import "./AuthorizationPage.css";
import React, { useEffect, useState } from 'react';
import {
  createAuthorization,
  getCustomerAuthorizations,
  getDocumentsByBank // 🔥 Added this service
} from '../../api/services';

const AuthorizationPage = () => {
  const [authorizations, setAuthorizations] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]); // 🔥 State for dropdown
  const [loading, setLoading] = useState(false);

  // Get User Data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const customerId = user?.id;
  const bankId = user?.bankId; // 🔥 Extract bankId from user object

  const [formData, setFormData] = useState({
    recipientName: '',
    cnicNumber: '',
    summary: '',
    purpose: '',
    documentId: '', // 🔥 Changed from docType string to documentId
    phone: '',
    validUntil: ''
  });

  useEffect(() => {
    if (customerId) fetchAuthorizations();
    if (bankId) fetchBankDocuments(); // 🔥 Fetch dropdown options on load
  }, [customerId, bankId]);

  const fetchBankDocuments = async () => {
    try {

      const res = await getDocumentsByBank(bankId);
      setDocumentTypes(res.data.documents || []);
    } catch (err) {
      console.error("Error fetching document types:", err);
    }
  };

  const fetchAuthorizations = async () => {
    try {
      setLoading(true);
      const res = await getCustomerAuthorizations(customerId);
      console.log("hurairas", res.data.data)
      setAuthorizations(res.data.data || []);
    } catch (err) {
      console.error("Fetch authorization:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔥 Send both customerId and bankId along with form data
      await createAuthorization({
        ...formData,
        customerId,
        bankId
      });

      setFormData({
        recipientName: '',
        cnicNumber: '',
        summary: '',
        purpose: '',
        documentId: '',
        phone: '',
        validUntil: ''
      });

      fetchAuthorizations();
    } catch (err) {
      alert("Error creating authorization");
    }
  };

  return (
    <div className="manager-dashboard">
      <div className="stats-row" style={{ gridTemplateColumns: '1fr' }}>
        <div className="stat-card" style={{ textAlign: 'left', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Generate Authorization Slip</h3>

          <form className="auth-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input
              type="text" placeholder="Recipient Name" className="auth-input" required
              value={formData.recipientName} onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
            />
            <input
              type="text" placeholder="Recipient CNIC Number" className="auth-input" required
              value={formData.cnicNumber} onChange={(e) => setFormData({ ...formData, cnicNumber: e.target.value })}
            />
            <input
              type="text" placeholder="Recipient Phone" className="auth-input" required
              value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {/* 🔥 Document Type Dropdown */}
            <select
              className="auth-input"
              required
              value={formData.documentId}
              onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
            >
              <option value="">Select Document Type</option>
              {documentTypes?.map((doc) => (
                <option style={{ color: "black" }} key={doc._id} value={doc._id}>
                  {doc.documentName}
                </option>
              ))}
            </select>

            <input
              type="date" className="auth-input" required
              value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
            <input
              type="text" placeholder="Purpose of Document" className="auth-input" required
              value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
            <textarea
              placeholder="Detail Summary" className="auth-input" style={{ gridColumn: 'span 2' }}
              value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />

            <button type="submit" className="submit-btn" style={{ width: 'fit-content', padding: '10px 30px' }}>
              Create Authorization
            </button>
          </form>
        </div>
      </div>

      <div className="dashboard-content" style={{ marginTop: '20px', gridTemplateColumns: "none " }}>
        <div className="cashiers-section" style={{ width: '100%' }}>
          <div className="section-header">
            <h3>My Personal Authorizations</h3>
          </div>

          <div className="auth-table-container">
            <table className="auth-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Slip Id</th>
                  <th>Doc Type</th>
                  <th>Phone</th>
                  <th>Purpose</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="skeleton-row">
                      <td><div className="skeleton"></div></td>
                      <td><div className="skeleton"></div></td>
                      <td><div className="skeleton"></div></td>
                      <td><div className="skeleton"></div></td>
                      <td><div className="skeleton"></div></td>
                      <td><div className="skeleton"></div></td>
                      <td><div className="skeleton"></div></td>
                    </tr>
                  ))
                ) : (
                  authorizations.map((auth) => (
                    <tr key={auth.id}>
                      <td>{auth.recipientName}</td>
                      <td>{auth.slipId}</td>
                      <td>{auth.documentId.documentName}</td>
                      <td>{auth.recipientPhoneNumber}</td>
                      <td>{auth.purpose}</td>
                      <td>{new Date(auth.validUntil).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${new Date(auth.validUntil) > new Date() ? 'active' : 'expired'}`}>
                          {new Date(auth.validUntil) > new Date() ? 'Active' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationPage;