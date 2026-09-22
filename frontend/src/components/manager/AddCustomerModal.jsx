import React, { useEffect, useRef, useState } from "react";

const AddCustomerModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    accountType: "",
    dob: "",
    cnicNumber: "",
    emails: [""], // ✅ store multiple emails
    fatherName: "",
    fatherCnic: "",
    motherName: "",
    motherCnic: "",
    password: ""  // ✅ password field
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");
  console.log(user.bankId)
  // files + previews
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicFrontPreview, setCnicFrontPreview] = useState(null);

  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [cnicBackPreview, setCnicBackPreview] = useState(null);
  
  // refs to hidden inputs
  const signatureInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const cnicFrontInputRef = useRef(null);
  const cnicBackInputRef = useRef(null);

  // Account type options
  const accountTypeOptions = [
    { value: "", label: "Select Account Type" },
    { value: "Savings", label: "Savings Account" },
    { value: "Current", label: "Current Account" },
    { value: "Business", label: "Business Account" },
    { value: "Student", label: "Student Account" }
  ];

  // cleanup object URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      [signaturePreview, profilePreview, cnicFrontPreview, cnicBackPreview].forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [signaturePreview, profilePreview, cnicFrontPreview, cnicBackPreview]);

  const uploadTextStyle = {
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: 1.2,
    color: "inherit",
    textAlign: "center"
  };

  const placeholderBoxStyle = {
    cursor: "pointer",
    minHeight: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #ccc",
    borderRadius: 6,
    padding: 8,
    background: "transparent"
  };

  const smallPlaceholderBoxStyle = {
    cursor: "pointer",
    minHeight: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #ccc",
    borderRadius: 6,
    padding: 6,
    background: "transparent"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double click

    setLoading(true);

    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("address", formData.address);
    payload.append("accountType", formData.accountType);
    payload.append("dob", formData.dob);
    payload.append("cnicNumber", formData.cnicNumber);
    payload.append("fatherName", formData.fatherName);
    payload.append("fatherCnic", formData.fatherCnic);
    payload.append("motherName", formData.motherName);
    payload.append("motherCnic", formData.motherCnic);
    payload.append("bankId", user.bankId);
    payload.append("password", formData.password); // ✅ Add password to payload

    formData.emails.forEach((email, index) => {
      payload.append(`emails[${index}]`, email);
    });

    if (signatureFile) payload.append("signature", signatureFile);
    if (profileFile) payload.append("profilePicture", profileFile);
    if (cnicFrontFile) payload.append("cnicFront", cnicFrontFile);
    if (cnicBackFile) payload.append("cnicBack", cnicBackFile);

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">

        <div className="modal-logo" aria-hidden>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <rect width="60" height="60" rx="12" fill="#3b82f6" />
            <path d="M30 15 C20 15, 15 25, 20 32 C25 39, 35 39, 40 32 C45 25, 40 15, 30 15" fill="white" />
            <path d="M25 28 Q30 35, 35 28" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <h2 id="add-customer-title">Add Customer</h2>
        <p className="modal-description">
          Add a new customer to keep track of their details and provide them with personalized service.
        </p>

        <form onSubmit={handleSubmit} className="two-column-form">
          <div className="form-column">
            <div className="form-section">
              <label className="form-section-title">Customer Detail</label>
              <div className="form-field-group">
                <div className="form-field">
                  <label htmlFor="customerName" className="field-label">
                    Customer Name
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    placeholder="Enter customer name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="customerAddress" className="field-label">
                    Customer Address
                  </label>
                  <input
                    id="customerAddress"
                    type="text"
                    placeholder="Enter customer address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="password" className="field-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter customer password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="field-label">Email Addresses</label>
                  {formData.emails.map((email, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <input
                        type="email"
                        placeholder={`Email ${index + 1}`}
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...formData.emails];
                          newEmails[index] = e.target.value;
                          setFormData({ ...formData, emails: newEmails });
                        }}
                        required
                        style={{ flex: 1, padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                      {formData.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newEmails = formData.emails.filter((_, i) => i !== index);
                            setFormData({ ...formData, emails: newEmails });
                          }}
                          style={{ padding: "4px 8px", background: "#ff4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, emails: [...formData.emails, ""] })}
                    style={{ marginTop: "6px", padding: "6px 12px", borderRadius: "4px", border: "1px solid #3b82f6", background: "white", color: "#3b82f6", cursor: "pointer" }}
                  >
                    + Add Email
                  </button>
                </div>


                <div className="form-row" style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                  <div className="form-field" style={{ flex: 1 }}>
                    <label htmlFor="accountType" className="field-label">
                      Account Type
                    </label>
                    <select
                      id="accountType"
                      value={formData.accountType}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      required
                      className="account-type-dropdown"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        cursor: "pointer"
                      }}
                    >
                      {accountTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.value === ""}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field" style={{ flex: 1 }}>
                    <label htmlFor="dob" className="field-label">
                      Date of Birth
                    </label>
                    <div className="date-input-container">
                      <input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        aria-label="Date of birth"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "14px"
                        }}
                      />
                      {formData.dob && (
                        <div className="date-formatted" style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                          {formatDate(formData.dob)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="upload-section" style={{ marginTop: "20px" }}>
              <label className="form-section-title" style={{ marginBottom: "12px" }}>
                Customer Images
              </label>
              <div className="upload-row" style={{ display: "flex", gap: "16px" }}>
                {/* Signature Image */}
                <div className="upload-box" style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
                    Signature Image
                  </label>

                  <div
                    className="upload-placeholder clickable"
                    onClick={() => signatureInputRef.current && signatureInputRef.current.click()}
                    style={{
                      ...placeholderBoxStyle,
                      flexDirection: "column",
                      gap: "8px",
                      padding: "16px 8px"
                    }}
                  >
                    {signaturePreview ? (
                      <img src={signaturePreview} alt="signature preview" style={{ maxHeight: "60px", objectFit: "contain" }} />
                    ) : (
                      <>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span style={uploadTextStyle}>Click to upload signature</span>
                      </>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={signatureInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      if (signaturePreview) URL.revokeObjectURL(signaturePreview);
                      const url = URL.createObjectURL(file);
                      setSignaturePreview(url);
                      setSignatureFile(file);
                    }}
                  />

                  {signaturePreview && (
                    <div style={{ marginTop: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(signaturePreview);
                          setSignaturePreview(null);
                          setSignatureFile(null);
                          if (signatureInputRef.current) signatureInputRef.current.value = "";
                        }}
                        style={{
                          background: "#ff4444",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Picture */}
                <div className="upload-box" style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
                    Profile Picture
                  </label>

                  <div
                    className="upload-placeholder clickable"
                    onClick={() => profileInputRef.current && profileInputRef.current.click()}
                    style={{
                      ...placeholderBoxStyle,
                      flexDirection: "column",
                      gap: "8px",
                      padding: "16px 8px"
                    }}
                  >
                    {profilePreview ? (
                      <img src={profilePreview} alt="profile preview" style={{ maxHeight: "60px", borderRadius: "6px", objectFit: "cover" }} />
                    ) : (
                      <>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span style={uploadTextStyle}>Click to upload profile</span>
                      </>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={profileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      if (profilePreview) URL.revokeObjectURL(profilePreview);
                      const url = URL.createObjectURL(file);
                      setProfilePreview(url);
                      setProfileFile(file);
                    }}
                  />

                  {profilePreview && (
                    <div style={{ marginTop: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(profilePreview);
                          setProfilePreview(null);
                          setProfileFile(null);
                          if (profileInputRef.current) profileInputRef.current.value = "";
                        }}
                        style={{
                          background: "#ff4444",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-column">
            <div className="form-section">
              <label className="form-section-title">CNIC Detail</label>
              <div className="form-field-group">
                <div className="form-field">
                  <label htmlFor="cnicNumber" className="field-label">
                    CNIC Number
                  </label>
                  <input
                    id="cnicNumber"
                    type="text"
                    placeholder="Enter CNIC number"
                    value={formData.cnicNumber}
                    onChange={(e) => setFormData({ ...formData, cnicNumber: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label style={{ display: "block", marginBottom: "12px", fontWeight: "500", fontSize: "14px" }}>
                    CNIC Images
                  </label>
                  <div className="upload-row" style={{ display: "flex", gap: "12px" }}>
                    {/* CNIC Front */}
                    <div className="upload-box small" style={{ flex: 1 }}>
                      <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
                        CNIC Front
                      </label>
                      <div
                        className="upload-placeholder small clickable"
                        onClick={() => cnicFrontInputRef.current && cnicFrontInputRef.current.click()}
                        style={{
                          ...smallPlaceholderBoxStyle,
                          flexDirection: "column",
                          gap: "6px",
                          padding: "12px 6px"
                        }}
                      >
                        {cnicFrontPreview ? (
                          <img src={cnicFrontPreview} alt="cnic front preview" style={{ maxHeight: "50px", objectFit: "cover" }} />
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span style={{ ...uploadTextStyle, fontSize: "12px" }}>Front</span>
                          </>
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={cnicFrontInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          if (cnicFrontPreview) URL.revokeObjectURL(cnicFrontPreview);
                          const url = URL.createObjectURL(file);
                          setCnicFrontPreview(url);
                          setCnicFrontFile(file);
                        }}
                      />

                      {cnicFrontPreview && (
                        <div style={{ marginTop: "6px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(cnicFrontPreview);
                              setCnicFrontPreview(null);
                              setCnicFrontFile(null);
                              if (cnicFrontInputRef.current) cnicFrontInputRef.current.value = "";
                            }}
                            style={{
                              background: "#ff4444",
                              color: "white",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              cursor: "pointer"
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* CNIC Back */}
                    <div className="upload-box small" style={{ flex: 1 }}>
                      <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
                        CNIC Back
                      </label>
                      <div
                        className="upload-placeholder small clickable"
                        onClick={() => cnicBackInputRef.current && cnicBackInputRef.current.click()}
                        style={{
                          ...smallPlaceholderBoxStyle,
                          flexDirection: "column",
                          gap: "6px",
                          padding: "12px 6px"
                        }}
                      >
                        {cnicBackPreview ? (
                          <img src={cnicBackPreview} alt="cnic back preview" style={{ maxHeight: "50px", objectFit: "cover" }} />
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span style={{ ...uploadTextStyle, fontSize: "12px" }}>Back</span>
                          </>
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={cnicBackInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          if (cnicBackPreview) URL.revokeObjectURL(cnicBackPreview);
                          const url = URL.createObjectURL(file);
                          setCnicBackPreview(url);
                          setCnicBackFile(file);
                        }}
                      />

                      {cnicBackPreview && (
                        <div style={{ marginTop: "6px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(cnicBackPreview);
                              setCnicBackPreview(null);
                              setCnicBackFile(null);
                              if (cnicBackInputRef.current) cnicBackInputRef.current.value = "";
                            }}
                            style={{
                              background: "#ff4444",
                              color: "white",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              cursor: "pointer"
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section" style={{ marginTop: "20px" }}>
              <label className="form-section-title">Customer Family Detail</label>
              <div className="form-field-group">
                <div className="form-field">
                  <label htmlFor="fatherName" className="field-label">
                    Father Name
                  </label>
                  <input
                    id="fatherName"
                    type="text"
                    placeholder="Enter father's name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="fatherCnic" className="field-label">
                    Father CNIC
                  </label>
                  <input
                    id="fatherCnic"
                    type="text"
                    placeholder="Enter father's CNIC"
                    value={formData.fatherCnic}
                    onChange={(e) => setFormData({ ...formData, fatherCnic: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="motherName" className="field-label">
                    Mother Name
                  </label>
                  <input
                    id="motherName"
                    type="text"
                    placeholder="Enter mother's name"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="motherCnic" className="field-label">
                    Mother CNIC
                  </label>
                  <input
                    id="motherCnic"
                    type="text"
                    placeholder="Enter mother's CNIC"
                    value={formData.motherCnic}
                    onChange={(e) => setFormData({ ...formData, motherCnic: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Adding Customer..." : "⚡ Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;