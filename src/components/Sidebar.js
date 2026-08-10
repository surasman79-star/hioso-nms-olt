import React from "react";
import "./Sidebar.css";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "ponPorts", label: "PON Ports", icon: "🔌" },
  { key: "gePorts", label: "GE Ports", icon: "🌐" },
  { key: "onuStatus", label: "ONU Status", icon: "📡" },
  { key: "onuTraffic", label: "ONU Traffic", icon: "📊" },
  { key: "onuConfig", label: "ONU Config", icon: "⚙️" },
];

function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🔷</span>
        <div>
          <div className="brand-title">Hioso NMS</div>
          <div className="brand-sub">OLT Management</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-item${active === item.key ? " active" : ""}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="status-dot online"></div>
        <span>System Online</span>
      </div>
    </aside>
  );
}

export default Sidebar;
