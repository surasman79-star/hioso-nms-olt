import React from "react";
import { ponPorts } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import "./TablePage.css";

function PonPorts() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">PON Ports</h1>
        <span className="page-meta">{ponPorts.length} ports</span>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Port Name</th>
              <th>Status</th>
              <th>ONU Count</th>
              <th>Max ONU</th>
              <th>Bandwidth</th>
              <th>RX Power (dBm)</th>
              <th>TX Power (dBm)</th>
            </tr>
          </thead>
          <tbody>
            {ponPorts.map((port) => (
              <tr key={port.id}>
                <td className="port-name">{port.name}</td>
                <td><StatusBadge status={port.status} /></td>
                <td>
                  <span className="onu-count">{port.onuCount}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(port.onuCount / port.maxOnu) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td>{port.maxOnu}</td>
                <td>{port.bandwidth}</td>
                <td className={port.rxPower !== null ? "power-value" : "na-value"}>
                  {port.rxPower !== null ? port.rxPower : "N/A"}
                </td>
                <td className={port.txPower !== null ? "power-value" : "na-value"}>
                  {port.txPower !== null ? port.txPower : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PonPorts;
