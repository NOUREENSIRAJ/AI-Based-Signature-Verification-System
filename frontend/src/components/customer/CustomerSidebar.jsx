import React from 'react';

const CustomerSidebar = ({ activeView, setActiveView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'Authorize', label: 'Authorize', icon: '👤' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="main-label">MAIN</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" style={{width : "100%"}} onClick={onLogout}>
          <span className="icon">☀</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default CustomerSidebar;
