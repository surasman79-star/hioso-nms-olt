import React, { useCallback } from "react";
import { getOnuTraffic } from "../services/api";
import { useOltData } from "../services/useOltData";
import "./TablePage.css";

function TrafficBar({ value, max = 100, color }) {
  return (
    <div className="traffic-bar-wrap">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(value, 100)}%`, background: color }}
        ></div>
      </div>
      <span className="traffic-pct">{value}%</span>
    </div>
  );
}

function OnuTraffic() {
  const fetchFn = useCallback(getOnuTraffic, []);
  const { data: onuTraffic, loading, error } = useOltData(fetchFn);

  if (loading && !onuTraffic) {
    return <div className="page-content"><div className="loading-state">Loading ONU traffic…</div></div>;
  }

  const traffic = onuTraffic || [];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">ONU Traffic</h1>
        <span className="page-meta">
          {traffic.length} active ONUs
          {error && <span className="error-inline"> · ⚠ {error}</span>}
        </span>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ONU ID</th>
              <th>PON Port</th>
              <th>Description</th>
              <th>Upstream (Mbps)</th>
              <th>US Utilization</th>
              <th>Downstream (Mbps)</th>
              <th>DS Utilization</th>
              <th>TX Bytes</th>
              <th>RX Bytes</th>
            </tr>
          </thead>
          <tbody>
            {traffic.map((t) => (
              <tr key={t.id}>
                <td className="port-name">{t.id}</td>
                <td>{t.ponPort}</td>
                <td>{t.description}</td>
                <td className="traffic-in">{t.upstream}</td>
                <td><TrafficBar value={parseFloat(t.upstreamUtil)} color="#58a6ff" /></td>
                <td className="traffic-out">{t.downstream}</td>
                <td><TrafficBar value={parseFloat(t.downstreamUtil)} color="#3fb950" /></td>
                <td>{Number(t.txBytes).toLocaleString()}</td>
                <td>{Number(t.rxBytes).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OnuTraffic;
