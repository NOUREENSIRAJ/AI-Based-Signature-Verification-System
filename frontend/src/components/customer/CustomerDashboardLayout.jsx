import React, { useState } from 'react';

import CustomerSidebar from './CustomerSidebar';
import CustomerDashboard from './CustomerDashboard';
import AuthorizationPage from './AuthorizationPage';


const CustomerDashboardLayout = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <CustomerDashboard />;
      case 'Authorize':
        return <AuthorizationPage />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="dashboard-layout">
      <CustomerSidebar
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

export default CustomerDashboardLayout;
