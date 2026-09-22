import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Managers from './Managers';
import Branches from './Branches';

const DashboardLayout = ({ onLogout }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'managers':
        return <Managers />;
      case 'branches':
        return <Branches />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
        onLogout={onLogout}
      />
      {renderContent()}
    </div>
  );
};

export default DashboardLayout;
