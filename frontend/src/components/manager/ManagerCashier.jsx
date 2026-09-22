import "./ManagerCashier.css";
import React, { useEffect, useState } from 'react';
import AddCashierModal from './AddCashierModal';
import {
  getCashiersByBank,
  getBranchCustomers,
  getLogsByBank,
  registerAccount
} from '../../api/services';
const ManagerCashier = () => {
  const [showModal, setShowModal] = useState(false);
  const [cashiers, setCashiers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    console.log(user)
    const bankId = user?.bankId;

    if (!bankId) return;
    try {
      setLoading(true);

      const [cashierRes, customerRes, logsRes] = await Promise.all([
        getCashiersByBank(bankId),
        getBranchCustomers(bankId),
        getLogsByBank(bankId)
      ]);
      console.log(cashierRes.data)
      console.log(customerRes.data)
      console.log(logsRes.data)

      setCashiers(cashierRes.data || []);
      setCustomers(customerRes.data || []);
      setLogs(logsRes.data || []);
      setLoading(false);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data) => {
    await registerAccount(data);

    const res = await fetchData();
    setShowModal(false);
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
      <div className="stats-row">
        <div className="stat-card">
          <h3>Activity</h3>
          <div className="stat-value">{logs.count}</div>
          <p>Number Of Activities</p>
        </div>

        <div className="stat-card">
          <h3>Cashier</h3>
          <div className="stat-value">{cashiers.count}</div>
          <p>Number of Cashier</p>
        </div>

        <div className="stat-card">
          <h3>Customers</h3>
          <div className="stat-value">{customers.count}</div>
          <p>Number of Customers</p>
        </div>
      </div>
      <div className="list-section">
        <div className="section-header">
          <h3>Cashiers</h3>
        </div>
        <div className="items-list">
          {cashiers?.cashiers?.map((cashier, index) => (
            <div key={cashier.id} className={`list-item ${index === 1 ? 'highlighted' : ''}`}>
              <img src={cashier.image} alt={cashier.name} className="item-avatar" />
              <div className="item-info">
                <span className="item-name">{cashier.name}</span>
                <span className="item-code">{cashier.address}</span>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="section-link" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>
          Add Cashiers →
        </a>
      </div>

      {showModal && <AddCashierModal onSubmit={onSubmit} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ManagerCashier;
