// CashierSidebar.jsx
import React from "react";
import PropTypes from "prop-types";
import { Home, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CashierSidebar({
  activeItem = "Dashboard",
  onItemClick = () => { },
}) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Logs", icon: FileText },
  ];

  const handleLogout = () => {
    // remove specific items
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // redirect to login
    window.location.href = "/";
  };

  return (
    <div className="w-[250px] min-h-screen border-r border-border bg-card flex flex-col">
      <div className="p-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Mains
        </p>

        <nav className="space-y-1" aria-label="Main">
          {menuItems.map((item) => {
            const isActive = item.name === activeItem;
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onItemClick(item.name)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-muted-foreground text-sm hover:bg-accent transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

CashierSidebar.propTypes = {
  activeItem: PropTypes.string,
  onItemClick: PropTypes.func,
};

export default CashierSidebar;