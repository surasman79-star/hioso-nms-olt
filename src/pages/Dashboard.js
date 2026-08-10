import React from "react";
import { oltInfo, ponPorts, onus } from "../data/mockData";
import "./Dashboard.css";

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function Dashboard() {
  const onlinePon = ponPorts.filter((p) => p.status === "up").length;
  const offlineOnu = onus.filter((o) => o.status === "offline").length;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="page-meta">Real-time OLT Overview</span>
      </div>

      <div className="olt-info-card">
        <div className="olt-info-grid">
          <div className="olt-field">
            <span className="olt-field-label">Device Name</span>
            <span className="olt-field-value">{oltInfo.name}</span>
          </div>
          <div className="olt-field">
            <span className="olt-field-label">IP Address</span>
            <span className="olt-field-value">{oltInfo.ip}</span>
          </div>
          <div className="olt-field">
            <span className="olt-field-label">Location</span>
            <span className="olt-field-value">{oltInfo.location}</span>
          </div>
          <div className="olt-field">
            <span className="olt-field-label">Uptime</span>
            <span className="olt-field-value">{oltInfo.uptime}</span>
          </div>
          <div className="olt-field">
            <span className="olt-field-label">Model</span>
            <span className="olt-field-value">{oltInfo.model}</span>
          </div>
          <div className="olt-field">
            <span className="olt-field-label">Firmware</span>
            <span className="olt-field-value">{oltInfo.firmware}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total PON Ports" value={oltInfo.totalPon} sub={`${onlinePon} Online`} color="#58a6ff" />
        <StatCard label="Total GE Ports" value={oltInfo.totalGe} sub="Active" color="#3fb950" />
        <StatCard label="Total ONU" value={oltInfo.totalOnu} sub={`${oltInfo.onlineOnu} Online`} color="#d2a8ff" />
        <StatCard label="ONU Offline" value={offlineOnu} sub="Need Attention" color="#f85149" />
      </div>

      <div className="pon-overview">
        <h2 className="section-title">PON Port Overview</h2>
        <div className="pon-grid">
          {ponPorts.map((port) => (
            <div key={port.id} className={`pon-box pon-${port.status}`}>
              <div className="pon-name">{port.name}</div>
              <div className="pon-count">{port.onuCount} ONU</div>
              <div className="pon-status">{port.status === "up" ? "UP" : "DOWN"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
