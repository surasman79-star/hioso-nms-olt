import React from "react";
import "./StatusBadge.css";

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="badge-dot"></span>
      {status === "up" || status === "online" ? "Online" : "Offline"}
    </span>
  );
}

export default StatusBadge;
