const express = require('express');
const cors = require('cors');
const config = require('./config');
const olt = require('./olt');

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/api/olt/info', async (req, res) => {
  try {
    const data = await olt.getOltInfo();
    // Attach derived totals from ONU list if available
    try {
      const onus = await olt.getOnus();
      data.totalOnu = onus.length;
      data.onlineOnu = onus.filter((o) => o.status === 'online').length;
    } catch (_) {}
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/olt/pon-ports', async (req, res) => {
  try {
    res.json(await olt.getPonPorts());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/olt/ge-ports', async (req, res) => {
  try {
    res.json(await olt.getGePorts());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/olt/onus', async (req, res) => {
  try {
    res.json(await olt.getOnus());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/olt/onu-traffic', async (req, res) => {
  try {
    res.json(await olt.getOnuTraffic());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/olt/onu-configs', async (req, res) => {
  try {
    res.json(await olt.getOnuConfigs());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/olt/diagnostics', async (req, res) => {
  try {
    res.json(await olt.getDiagnostics());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', oltIp: config.OLT_IP, time: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = config.API_PORT;
app.listen(PORT, () => {
  console.log(`[server] API running on http://localhost:${PORT}`);
  console.log(`[server] OLT IP: ${config.OLT_IP}  SNMP community: ***`);
  console.log(`[server] Mode: ${config.USE_SSH ? 'SSH' : 'SNMP'}`);
  console.log(`[server] Mock fallback: ${config.MOCK_FALLBACK ? 'enabled' : 'disabled'}`);
});
