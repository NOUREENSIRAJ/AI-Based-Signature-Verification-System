import React, { useEffect, useState } from 'react';
import AddBranchModal from './AddBranchModal';
import BranchDetail from './BranchDetail';
import { fetchAllBanks, createBank } from '../api/services';
/* ================= Skeleton Component ================= */
const SkeletonBox = ({ width, height, borderRadius = 8 }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius
      }}
    />
  );
};

const Branches = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= Fetch Branches ================= */
  const loadBranches = async () => {
    try {
      setLoading(true);

      const res = await fetchAllBanks();

      console.log("responsed", res.data);

      setBranches(res.data || []);

    } catch (err) {
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  /* ================= Add Branch ================= */
  const handleAddBranch = async (data) => {
    try {
      await createBank(data);

      setShowModal(false);

      loadBranches();

    } catch (err) {
      console.error('Error creating branch:', err);
    }
  };

  /* ================= Branch Detail ================= */
  if (selectedBranch) {
    return (
      <BranchDetail
        branch={selectedBranch}
        onBack={() => setSelectedBranch(null)}
      />
    );
  }

  return (
    <div className="main-content">

      {/* ================= Branch Cards ================= */}
      <div className="cards-grid">

        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div className="branch-card" key={i}>

              <SkeletonBox width="50%" height="12px" />

              <div style={{ marginTop: 12 }}>
                <SkeletonBox width="80%" height="22px" />
              </div>

              <div style={{ marginTop: 10 }}>
                <SkeletonBox width="65%" height="14px" />
              </div>

            </div>
          ))
        ) : branches?.length > 0 ? (
          branches.map((branch) => (
            <div
              key={branch._id || branch.id}
              className="branch-card"
              onClick={() => setSelectedBranch(branch)}
            >

              {/* Top */}
              <div className="branch-top">

                <div className="branch-avatar">
                  🏦
                </div>

                <div>
                  <p className="manager-label">Manager</p>

                  <p className="manager-name">
                    {branch?.managerId?.name || 'No Manager'}
                  </p>
                </div>

              </div>

              {/* Branch Info */}
              <div className="branch-content">

                <h3 className="branch-code">
                  {branch.name || branch._id}
                </h3>

                <p className="address">
                  📍 {branch.address}
                </p>

              </div>

              {/* Bottom */}
              <div className="branch-footer">

                <span className="branch-status">
                  Active
                </span>

                <button className="view-btn">
                  View Details →
                </button>

              </div>

            </div>
          ))
        ) : (
          <p>No branches found</p>
        )}

      </div>

      {/* ================= Add Button ================= */}
      <button className="add-btn" onClick={() => setShowModal(true)}>
        <span className="icon">📄</span>
        Add Branch
      </button>

      {/* ================= Modal ================= */}
      {showModal && (
        <AddBranchModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddBranch}
        />
      )}

    </div>
  );
};

export default Branches;