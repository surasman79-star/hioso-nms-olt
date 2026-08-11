import React, { useState, useCallback } from "react";
import { getOnus } from "../services/api";
import { useOltData } from "../services/useOltData";
import StatusBadge from "../components/StatusBadge";
import "./TablePage.css";

function OnuStatus() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchFn = useCallback(getOnus, []);
  const { data: onus, loading, error } = useOltData(fetchFn);

  const allOnus = onus || [];

  const filtered = allOnus.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase()) ||
      o.serialNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading && !onus) {
    return <div className="page-content"><div className="loading-state">Loading ONU status…</div></div>;
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">ONU Status</h1>
        <span className="page-meta">
          {allOnus.filter((o) => o.status === "online").length} / {allOnus.length} online
          {error && <span className="error-inline"> · ⚠ {error}</span>}
        </span>
      </div>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search ONU ID, serial, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {["all", "online", "offline"].map((f) => (
            <button
              key={f}
              className={`filter-tab${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ONU ID</th>
              <th>PON Port</th>
              <th>Serial Number</th>
              <th>Type</th>
              <th>Status</th>
              <th>Distance (km)</th>
              <th>RX Power (dBm)</th>
              <th>TX Power (dBm)</th>
              <th>Uptime</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((onu) => (
              <tr key={onu.id}>
                <td className="port-name">{onu.id}</td>
                <td>{onu.ponPort}</td>
                <td><code>{onu.serialNumber}</code></td>
                <td>{onu.type}</td>
                <td><StatusBadge status={onu.status} /></td>
                <td>{onu.distance}</td>
                <td className={onu.rxPower !== null ? "power-value" : "na-value"}>
                  {onu.rxPower !== null ? onu.rxPower : "N/A"}
                </td>
                <td className={onu.txPower !== null ? "power-value" : "na-value"}>
                  {onu.txPower !== null ? onu.txPower : "N/A"}
                </td>
                <td>{onu.uptime}</td>
                <td>{onu.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No ONU found.</div>}
      </div>
    </div>
  );
}

export default OnuStatus;
