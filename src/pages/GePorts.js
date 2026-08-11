import React, { useCallback } from "react";
import { getGePorts } from "../services/api";
import { useOltData } from "../services/useOltData";
import StatusBadge from "../components/StatusBadge";
import "./TablePage.css";

function GePorts() {
  const fetchFn = useCallback(getGePorts, []);
  const { data: gePorts, loading, error } = useOltData(fetchFn);

  if (loading && !gePorts) {
    return <div className="page-content"><div className="loading-state">Loading GE ports…</div></div>;
  }

  const ports = gePorts || [];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">GE Ports</h1>
        <span className="page-meta">{ports.length} ports{error && <span className="error-inline"> · ⚠ {error}</span>}</span>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Port Name</th>
              <th>Status</th>
              <th>Role</th>
              <th>Speed</th>
              <th>Duplex</th>
              <th>In Traffic</th>
              <th>Out Traffic</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((port) => (
              <tr key={port.id}>
                <td className="port-name">{port.name}</td>
                <td><StatusBadge status={port.status} /></td>
                <td><span className="role-badge">{port.role}</span></td>
                <td>{port.speed}</td>
                <td>{port.duplex}</td>
                <td className="traffic-in">{port.inTraffic}</td>
                <td className="traffic-out">{port.outTraffic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GePorts;
