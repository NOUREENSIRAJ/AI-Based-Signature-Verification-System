import React, { useEffect, useState } from 'react';
import AddManagerModal from './AddManagerModal';
import { getAllManagers, registerAccount } from "../api/services";

/* ================= Skeleton ================= */
const SkeletonBox = ({ width, height, borderRadius = 8 }) => {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius }}
    />
  );
};

const Managers = () => {
  const [showModal, setShowModal] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch Managers ================= */
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);

        const res = await getAllManagers();
        setManagers(res.data.managers || []);

      } catch (error) {
        console.log("Error fetching managers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  /* ================= Add Manager ================= */
  const handleAddManager = async (data) => {
    await registerAccount(data);

    const res = await getAllManagers();
    setManagers(res.data.managers);

    setShowModal(false);
  };

  return (
    <div className="main-content">

      {/* ================= Cards Grid ================= */}
      <div className="cards-grid">

        {loading
          ? [1, 2, 3, 4].map((i) => (
            <div key={i} className="manager-card">
              <SkeletonBox height="100px" />

              <div className="manager-card-content">
                <SkeletonBox width="60%" height="12px" />
                <SkeletonBox width="80%" height="18px" />
                <SkeletonBox width="70%" height="12px" />
              </div>
            </div>
          ))
          : managers.length > 0 ? (
            managers.map((manager) => (
              <div key={manager._id} className="manager-card">

                {/* Top Section */}
                <div className="manager-top">

                  <div className="manager-image-wrapper">
                    <img
                      src={manager.image || "https://via.placeholder.com/100"}
                      alt={manager.name}
                      className="manager-image"
                    />
                  </div>

                </div>

                {/* Content */}
                <div className="manager-card-content">

                  <p className="manager-bank">
                    🏦 {manager?.bankId?.name || "No Branch"}
                  </p>

                  <h3 className="manager-name">
                    {manager.name}
                  </h3>

                  <p className="manager-address">
                    📍 {manager.address}
                  </p>

                </div>

                {/* Footer */}
              

              </div>
            ))
          ) : (
            !loading && <p>No managers found</p>
          )
        }

      </div>

      {/* ================= Add Button ================= */}
      <button className="add-btn" onClick={() => setShowModal(true)}>
        <span className="icon">📄</span>
        Add Manager
      </button>

      {/* ================= Modal ================= */}
      {showModal && (
        <AddManagerModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddManager}
        />
      )}
    </div>
  );
};

export default Managers;