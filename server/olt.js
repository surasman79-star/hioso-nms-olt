/**
 * OLT Connector Module
 *
 * Supports two backends:
 *   - SNMP  (default, USE_SSH=false): polls OLT via net-snmp
 *   - SSH   (USE_SSH=true):           logs in via SSH and parses CLI output
 *
 * When a real OLT is not reachable the module falls back to mock data so the
 * UI keeps working during development.
 */

const snmp = require('net-snmp');
const { NodeSSH } = require('node-ssh');
const config = require('./config');
const mockData = require('./mockData');

// ---------------------------------------------------------------------------
// OID definitions (standard IF-MIB + common GPON vendor OIDs)
// ---------------------------------------------------------------------------
const OID = {
  sysDescr:    '1.3.6.1.2.1.1.1.0',
  sysUpTime:   '1.3.6.1.2.1.1.3.0',
  sysName:     '1.3.6.1.2.1.1.5.0',
  ifDescr:     '1.3.6.1.2.1.2.2.1.2',      // table
  ifOperStatus:'1.3.6.1.2.1.2.2.1.8',       // table: 1=up, 2=down
  ifSpeed:     '1.3.6.1.2.1.2.2.1.5',       // table
  ifInOctets:  '1.3.6.1.2.1.2.2.1.10',      // table
  ifOutOctets: '1.3.6.1.2.1.2.2.1.16',      // table
};
const interfaceCounterCache = new Map();

// ---------------------------------------------------------------------------
// SNMP helpers
// ---------------------------------------------------------------------------
function createSession() {
  return snmp.createSession(config.OLT_IP, config.SNMP_COMMUNITY, {
    version: config.SNMP_VERSION,
    port: config.SNMP_PORT,
    timeout: config.SNMP_TIMEOUT,
    retries: config.SNMP_RETRIES,
  });
}

function snmpGet(oids) {
  return new Promise((resolve, reject) => {
    const session = createSession();
    session.get(oids, (err, varbinds) => {
      session.close();
      if (err) return reject(err);
      resolve(varbinds);
    });
  });
}

function snmpSubtree(oid) {
  return new Promise((resolve, reject) => {
    const session = createSession();
    const results = [];
    session.subtree(oid, 20, (varbinds) => {
      for (const vb of varbinds) {
        if (snmp.isVarbindError(vb)) continue;
        results.push(vb);
      }
    }, (err) => {
      session.close();
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function vbValue(vb) {
  if (!vb || snmp.isVarbindError(vb)) return null;
  const v = vb.value;
  if (Buffer.isBuffer(v)) return v.toString('utf8').replace(/\0/g, '').trim();
  return v;
}

function formatUptime(timeticks) {
  if (!timeticks) return '---';
  const totalSec = Math.floor(timeticks / 100);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function formatBps(bps) {
  if (!bps) return '0 Mbps';
  const mbps = (bps / 1e6).toFixed(1);
  return `${mbps} Mbps`;
}

// ---------------------------------------------------------------------------
// SSH helpers
// ---------------------------------------------------------------------------
async function sshExec(command) {
  const ssh = new NodeSSH();
  await ssh.connect({
    host: config.OLT_IP,
    port: config.SSH_PORT,
    username: config.SSH_USER,
    password: config.SSH_PASS,
    readyTimeout: config.SNMP_TIMEOUT,
  });
  const result = await ssh.execCommand(command);
  ssh.dispose();
  return result.stdout;
}

// ---------------------------------------------------------------------------
// SNMP data collectors
// ---------------------------------------------------------------------------
async function getOltInfoSNMP() {
  const vbs = await snmpGet([OID.sysName, OID.sysUpTime, OID.sysDescr]);
  const uptime = vbValue(vbs[1]);
  return {
    name: vbValue(vbs[0]) || config.OLT_NAME,
    ip: config.OLT_IP,
    location: config.OLT_LOCATION,
    uptime: formatUptime(typeof uptime === 'number' ? uptime : parseInt(uptime, 10)),
    model: config.OLT_MODEL,
    firmware: vbValue(vbs[2]) || 'Unknown',
    totalPon: 8,
    totalGe: 4,
  };
}

async function getIfTableSNMP() {
  const [descrVbs, statusVbs, speedVbs, inVbs, outVbs] = await Promise.all([
    snmpSubtree(OID.ifDescr),
    snmpSubtree(OID.ifOperStatus),
    snmpSubtree(OID.ifSpeed),
    snmpSubtree(OID.ifInOctets),
    snmpSubtree(OID.ifOutOctets),
  ]);

  // Build indexed maps
  const byIdx = (vbs) => {
    const m = {};
    for (const vb of vbs) {
      const idx = vb.oid.split('.').pop();
      m[idx] = vb.value;
    }
    return m;
  };

  const descr  = byIdx(descrVbs);
  const status = byIdx(statusVbs);
  const speed  = byIdx(speedVbs);
  const inOct  = byIdx(inVbs);
  const outOct = byIdx(outVbs);

  const ifaces = [];
  for (const idx of Object.keys(descr)) {
    ifaces.push({
      idx,
      name:      descr[idx]  || `IF${idx}`,
      status:    status[idx] === 1 ? 'up' : 'down',
      speed:     speed[idx]  || 0,
      inOctets:  inOct[idx]  || 0,
      outOctets: outOct[idx] || 0,
    });
  }
  return ifaces;
}

async function getPonPortsSNMP(ifaces) {
  const ponIfaces = ifaces.filter((i) =>
    /gpon|pon|xpon/i.test(i.name)
  );
  return ponIfaces.map((i, idx) => ({
    id:        idx + 1,
    name:      i.name,
    status:    i.status,
    onuCount:  0,   // ONU count needs vendor OID; 0 as placeholder
    maxOnu:    128,
    bandwidth: i.speed >= 10e9 ? '10G' : i.speed >= 1e9 ? '1G' : '---',
    rxPower:   null,
    txPower:   null,
  }));
}

async function getGePortsSNMP(ifaces) {
  const geIfaces = ifaces.filter((i) =>
    /ge|gige|ethernet|eth/i.test(i.name) && !/gpon|pon/i.test(i.name)
  );
  return geIfaces.map((i, idx) => {
    const now = Date.now();
    const currentIn = Number(i.inOctets) || 0;
    const currentOut = Number(i.outOctets) || 0;
    const prev = interfaceCounterCache.get(i.idx);
    let inBps = 0;
    let outBps = 0;
    if (prev) {
      const deltaSec = Math.max((now - prev.ts) / 1000, 1);
      const wrap32 = 0x100000000;
      const deltaIn = currentIn >= prev.inOctets
        ? currentIn - prev.inOctets
        : (wrap32 - prev.inOctets) + currentIn;
      const deltaOut = currentOut >= prev.outOctets
        ? currentOut - prev.outOctets
        : (wrap32 - prev.outOctets) + currentOut;
      inBps = (deltaIn * 8) / deltaSec;
      outBps = (deltaOut * 8) / deltaSec;
    }
    interfaceCounterCache.set(i.idx, { inOctets: currentIn, outOctets: currentOut, ts: now });
    const speedStr = i.speed >= 1e9 ? '1000M' : i.speed >= 100e6 ? '100M' : i.speed > 0 ? `${i.speed / 1e6}M` : '---';
    return {
      id:         idx + 1,
      name:       i.name,
      status:     i.status,
      speed:      speedStr,
      duplex:     'Full',
      inTraffic:  formatBps(inBps),
      outTraffic: formatBps(outBps),
      role:       idx === 0 ? 'Uplink' : 'Management',
    };
  });
}

// ---------------------------------------------------------------------------
// SSH data collectors (Huawei MA5600/5800 CLI style)
// ---------------------------------------------------------------------------
async function getOltInfoSSH() {
  const out = await sshExec('display version');
  const firmware = (out.match(/version\s+([^\n]+)/i) || [])[1] || 'Unknown';
  const upOut = await sshExec('display sysuptime');
  const uptime = (upOut.match(/(\d+d\s*\d+h\s*\d+m)/i) || [])[1] || '---';
  return {
    name: config.OLT_NAME,
    ip: config.OLT_IP,
    location: config.OLT_LOCATION,
    uptime,
    model: config.OLT_MODEL,
    firmware,
    totalPon: 8,
    totalGe: 4,
  };
}

async function getOnusSSH() {
  const out = await sshExec('display ont info summary all');
  const lines = out.split('\n');
  const onus = [];
  for (const line of lines) {
    // Parse lines like: "0/1  1  HTXH0001ABCD  online  1.2km  -18.5  2.5  ..."
    const m = line.match(/(\d+\/\d+)\s+(\d+)\s+([A-Z0-9]{12,16})\s+(online|offline)/i);
    if (!m) continue;
    const [, port, onuId, serial, status] = m;
    onus.push({
      id:           `ONU-${port.replace('/', '-')}-${String(onuId).padStart(3, '0')}`,
      ponPort:      `PON ${port}`,
      slot:         parseInt(port.split('/')[0], 10),
      onuId:        parseInt(onuId, 10),
      serialNumber: serial,
      mac:          '---',
      type:         '---',
      status:       status.toLowerCase(),
      distance:     null,
      rxPower:      null,
      txPower:      null,
      uptime:       '---',
      description:  '',
    });
  }
  return onus;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

async function withFallback(label, fallbackData, fn) {
  try {
    return await fn();
  } catch (err) {
    if (config.MOCK_FALLBACK) {
      console.warn(`[OLT] ${label} failed, using mock data:`, err.message);
      return fallbackData;
    }
    throw new Error(`${label} failed: ${err.message}`);
  }
}

async function getOltInfo() {
  return withFallback('getOltInfo', mockData.oltInfo, async () => {
    return config.USE_SSH ? await getOltInfoSSH() : await getOltInfoSNMP();
  });
}

async function getPonPorts() {
  return withFallback('getPonPorts', mockData.ponPorts, async () => {
    if (config.USE_SSH) return mockData.ponPorts; // SSH pon ports not yet implemented
    const ifaces = await getIfTableSNMP();
    const ports = await getPonPortsSNMP(ifaces);
    if (ports.length) return ports;
    if (config.MOCK_FALLBACK) return mockData.ponPorts;
    throw new Error('No PON interface detected from SNMP ifDescr.');
  });
}

async function getGePorts() {
  return withFallback('getGePorts', mockData.gePorts, async () => {
    if (config.USE_SSH) return mockData.gePorts;
    const ifaces = await getIfTableSNMP();
    const ports = await getGePortsSNMP(ifaces);
    if (ports.length) return ports;
    if (config.MOCK_FALLBACK) return mockData.gePorts;
    throw new Error('No GE interface detected from SNMP ifDescr.');
  });
}

async function getOnus() {
  return withFallback('getOnus', mockData.onus, async () => {
    if (config.USE_SSH) return await getOnusSSH();
    // SNMP ONU list needs vendor-specific OIDs; fall back to mock
    return mockData.onus;
  });
}

async function getOnuTraffic() {
  return withFallback('getOnuTraffic', mockData.onuTraffic, async () => {
    // Traffic counters require vendor-specific SNMP OIDs or SSH
    // Returning mock data until vendor OIDs are configured
    return mockData.onuTraffic;
  });
}

async function getOnuConfigs() {
  return withFallback('getOnuConfigs', mockData.onuConfigs, async () => {
    return mockData.onuConfigs;
  });
}

async function getDiagnostics() {
  const diagnostics = {
    mode: config.USE_SSH ? 'SSH' : 'SNMP',
    oltIp: config.OLT_IP,
    mockFallbackEnabled: config.MOCK_FALLBACK,
    checks: [],
  };

  if (config.USE_SSH) {
    try {
      await sshExec('display version');
      diagnostics.checks.push({ name: 'ssh', ok: true });
    } catch (err) {
      diagnostics.checks.push({ name: 'ssh', ok: false, error: err.message });
    }
    return diagnostics;
  }

  const checks = [
    { name: 'sysName', oid: OID.sysName },
    { name: 'sysDescr', oid: OID.sysDescr },
    { name: 'ifDescr', oid: OID.ifDescr, subtree: true },
  ];

  for (const check of checks) {
    try {
      if (check.subtree) {
        const rows = await snmpSubtree(check.oid);
        diagnostics.checks.push({ name: check.name, ok: rows.length > 0, count: rows.length });
      } else {
        const vbs = await snmpGet([check.oid]);
        diagnostics.checks.push({ name: check.name, ok: true, value: vbValue(vbs[0]) });
      }
    } catch (err) {
      diagnostics.checks.push({ name: check.name, ok: false, error: err.message });
    }
  }

  return diagnostics;
}

module.exports = {
  getOltInfo,
  getPonPorts,
  getGePorts,
  getOnus,
  getOnuTraffic,
  getOnuConfigs,
  getDiagnostics,
};
