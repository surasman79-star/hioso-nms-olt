import React from "react";
import { gePorts } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import "./TablePage.css";

function GePorts() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">GE Ports</h1>
        <span className="page-meta">{gePorts.length} ports</span>
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
            {gePorts.map((port) => (
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
