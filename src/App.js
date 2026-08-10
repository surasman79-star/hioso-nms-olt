import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PonPorts from "./pages/PonPorts";
import GePorts from "./pages/GePorts";
import OnuStatus from "./pages/OnuStatus";
import OnuTraffic from "./pages/OnuTraffic";
import OnuConfig from "./pages/OnuConfig";

const pages = {
  dashboard: Dashboard,
  ponPorts: PonPorts,
  gePorts: GePorts,
  onuStatus: OnuStatus,
  onuTraffic: OnuTraffic,
  onuConfig: OnuConfig,
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        <PageComponent />
      </main>
    </div>
  );
}

export default App;
