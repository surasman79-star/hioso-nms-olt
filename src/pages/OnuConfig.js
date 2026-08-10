import React, { useState } from "react";
import { onuConfigs } from "../data/mockData";
import "./TablePage.css";

function OnuConfig() {
  const [selected, setSelected] = useState(null);
  const cfg = onuConfigs.find((c) => c.id === selected);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">ONU Configuration</h1>
        <span className="page-meta">Click a row to view details</span>
      </div>
      <div className="config-layout">
        <div className="table-card config-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ONU ID</th>
                <th>PON Port</th>
                <th>Serial Number</th>
                <th>Type</th>
                <th>VLAN</th>
                <th>Profile</th>
                <th>Bandwidth</th>
                <th>Admin Status</th>
              </tr>
            </thead>
            <tbody>
              {onuConfigs.map((cfg) => (
                <tr
                  key={cfg.id}
                  className={`clickable-row${selected === cfg.id ? " selected-row" : ""}`}
                  onClick={() => setSelected(cfg.id === selected ? null : cfg.id)}
                >
                  <td className="port-name">{cfg.id}</td>
                  <td>{cfg.ponPort}</td>
                  <td><code>{cfg.serialNumber}</code></td>
                  <td>{cfg.type}</td>
                  <td>{cfg.vlan}</td>
                  <td>{cfg.profile}</td>
                  <td>{cfg.bandwidthProfile}</td>
                  <td>
                    <span className={`admin-badge admin-${cfg.adminStatus}`}>
                      {cfg.adminStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cfg && (
          <div className="detail-panel">
            <div className="detail-header">
              <span className="detail-title">ONU Detail</span>
              <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="detail-grid">
              {[
                ["ONU ID", cfg.id],
                ["Serial Number", cfg.serialNumber],
                ["PON Port", cfg.ponPort],
                ["Type", cfg.type],
                ["Description", cfg.description],
                ["VLAN", cfg.vlan],
                ["Profile", cfg.profile],
                ["PPPoE User", cfg.pppoeUser],
                ["GEM Port", cfg.gemPort],
                ["T-CONT ID", cfg.tcontId],
                ["Bandwidth Profile", cfg.bandwidthProfile],
                ["Admin Status", cfg.adminStatus],
              ].map(([k, v]) => (
                <div key={k} className="detail-row">
                  <span className="detail-key">{k}</span>
                  <span className="detail-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnuConfig;
