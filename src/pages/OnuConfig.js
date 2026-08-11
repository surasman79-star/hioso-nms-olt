import React, { useState, useCallback } from "react";
import { getOnuConfigs } from "../services/api";
import { useOltData } from "../services/useOltData";
import "./TablePage.css";

function OnuConfig() {
  const [selected, setSelected] = useState(null);

  const fetchFn = useCallback(getOnuConfigs, []);
  const { data: onuConfigs, loading, error } = useOltData(fetchFn);

  const configs = onuConfigs || [];
  const cfg = configs.find((c) => c.id === selected);

  if (loading && !onuConfigs) {
    return <div className="page-content"><div className="loading-state">Loading ONU config…</div></div>;
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">ONU Configuration</h1>
        <span className="page-meta">
          Click a row to view details
          {error && <span className="error-inline"> · ⚠ {error}</span>}
        </span>
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
              {configs.map((c) => (
                <tr
                  key={c.id}
                  className={`clickable-row${selected === c.id ? " selected-row" : ""}`}
                  onClick={() => setSelected(c.id === selected ? null : c.id)}
                >
                  <td className="port-name">{c.id}</td>
                  <td>{c.ponPort}</td>
                  <td><code>{c.serialNumber}</code></td>
                  <td>{c.type}</td>
                  <td>{c.vlan}</td>
                  <td>{c.profile}</td>
                  <td>{c.bandwidthProfile}</td>
                  <td>
                    <span className={`admin-badge admin-${c.adminStatus}`}>
                      {c.adminStatus}
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
