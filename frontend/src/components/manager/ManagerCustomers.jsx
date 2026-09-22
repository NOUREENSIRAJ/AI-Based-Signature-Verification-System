import "./ManagerCashier.css";
import React, { useEffect, useState } from 'react';
import AddCustomerModal from './AddCustomerModal';

import {
  createCustomer,
  getBranchCustomers,
  getCashiersByBank,
  getLogsByBank,
} from '../../api/services';

const ManagerCustomers = () => {

  const [showModal, setShowModal] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ================= Fetch ================= */

  const fetchData = async () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    const bankId = user?.bankId;

    if (!bankId) return;

    try {
      setLoading(true);

      const [
        customerRes,
        cashierRes,
        logsRes
      ] = await Promise.all([
        getBranchCustomers(bankId),
        getCashiersByBank(bankId),
        getLogsByBank(bankId)
      ]);

      console.log("Customers:", customerRes.data);
      console.log("Cashiers:", cashierRes.data);
      console.log("Logs:", logsRes.data);

      setCustomers(customerRes.data || []);
      setCashiers(cashierRes.data || []);

      /* IMPORTANT FIX */
      setLogs(logsRes.data.logs || []);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Add Customer ================= */

  const onSubmit = async (data) => {
    try {

      await createCustomer(data);

      await fetchData();

      setShowModal(false);

    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= Graph Logic ================= */

  const getMonthlyLogs = () => {

    const months = Array(12).fill(0);

    logs.forEach((log) => {

      if (!log.createdAt) return;

      const month = new Date(
        log.createdAt
      ).getMonth();

      months[month]++;
    });

    return months;
  };

  const generatePath = (data) => {

    const max = Math.max(...data, 1);

    const stepX = 400 / (data.length - 1);

    return data
      .map((value, i) => {

        const x = i * stepX;

        const y =
          120 - (value / max) * 100;

        return `${
          i === 0 ? "M" : "L"
        } ${x} ${y}`;

      })
      .join(" ");
  };

  const monthlyLogs = getMonthlyLogs();

  const linePath = generatePath(monthlyLogs);

  const areaPath =
    `${linePath} L 400 150 L 0 150 Z`;

  /* ================= Skeleton ================= */

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

  /* ================= Loading UI ================= */

  if (loading) {
    return (
      <div className="manager-dashboard">

        {/* Stats */}
        <div className="stats-row">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Graph Skeleton */}
        <div className="growth-card">
          <div className="skeleton title"></div>

          <div
            className="skeleton"
            style={{
              width: "100%",
              height: "220px",
              marginTop: 20,
              borderRadius: 20
            }}
          ></div>
        </div>

        {/* Customers Skeleton */}
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

  /* ================= Main UI ================= */

  return (
    <div className="manager-dashboard">

      {/* ================= Stats ================= */}

      <div className="stats-row">

        <div className="stat-card">
          <h3>Activity</h3>

          <div className="stat-value">
            {logs?.length || 0}
          </div>

          <p>Number Of Activities</p>
        </div>

        <div className="stat-card">
          <h3>Cashier</h3>

          <div className="stat-value">
            {cashiers?.cashiers?.length || 0}
          </div>

          <p>Number of Cashier</p>
        </div>

        <div className="stat-card">
          <h3>Customers</h3>

          <div className="stat-value">
            {customers?.customers?.length || 0}
          </div>

          <p>Number of Customers</p>
        </div>

      </div>

     

      {/* ================= Customers ================= */}

      <div className="list-section">

        <div className="section-header">
          <h3>Customers</h3>
        </div>

        <div className="items-list">

          {customers?.customers?.length > 0 ? (

            customers.customers.map((
              customer,
              index
            ) => (

              <div
                key={customer._id || index}
                className={`list-item ${
                  index === 1
                    ? 'highlighted'
                    : ''
                }`}
              >

                <img
                  src={
                    customer.profilePicture ||
                    'https://i.pravatar.cc/40'
                  }

                  alt={customer.name}

                  className="item-avatar"
                />

                <div className="item-info">

                  <span className="item-name">
                    {customer.name}
                  </span>

                  <span className="item-code">
                    {customer.cnicNumber || 'N/A'}
                  </span>

                </div>

              </div>
            ))

          ) : (
            <p style={{ padding: "10px" }}>
              No customers found
            </p>
          )}

        </div>

        <a
          href="#"
          className="section-link"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          Add Customers →
        </a>

      </div>

      {/* ================= Modal ================= */}

      {showModal && (
        <AddCustomerModal
          onSubmit={onSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
};

export default ManagerCustomers;