import React, { useState } from 'react';
import ManagerSidebar from './ManagerSidebar';
import ManagerDashboard from './ManagerDashboard';
import ManagerCashier from './ManagerCashier';
import ManagerCustomers from './ManagerCustomers';
import ManagerDocument from './ManagerDocument';
import ManagerLogs from './ManagerLogs';

const ManagerDashboardLayout = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <ManagerDashboard />;
      case 'cashier':
        return <ManagerCashier />;
      case 'customers':
        return <ManagerCustomers />;
      case 'document':
        return <ManagerDocument />;
      case 'logs':
        return <ManagerLogs />;
      default:
        return <ManagerDashboard />;
    }
  };

  return (
    <div className="dashboard-layout">
      <ManagerSidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={onLogout}
      />
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default ManagerDashboardLayout;
