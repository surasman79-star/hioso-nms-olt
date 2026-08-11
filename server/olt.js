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
    const mbpsIn  = i.speed > 0 ? ((i.inOctets  * 8) / i.speed * 100).toFixed(1) : '0';
    const mbpsOut = i.speed > 0 ? ((i.outOctets * 8) / i.speed * 100).toFixed(1) : '0';
    const speedStr = i.speed >= 1e9 ? '1000M' : i.speed >= 100e6 ? '100M' : i.speed > 0 ? `${i.speed / 1e6}M` : '---';
    return {
      id:         idx + 1,
      name:       i.name,
      status:     i.status,
      speed:      speedStr,
      duplex:     'Full',
      inTraffic:  formatBps(i.inOctets),
      outTraffic: formatBps(i.outOctets),
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

async function getOltInfo() {
  try {
    return config.USE_SSH ? await getOltInfoSSH() : await getOltInfoSNMP();
  } catch (err) {
    console.warn('[OLT] getOltInfo failed, using mock data:', err.message);
    return mockData.oltInfo;
  }
}

async function getPonPorts() {
  try {
    if (config.USE_SSH) return mockData.ponPorts; // SSH pon ports not yet implemented
    const ifaces = await getIfTableSNMP();
    const ports = await getPonPortsSNMP(ifaces);
    return ports.length ? ports : mockData.ponPorts;
  } catch (err) {
    console.warn('[OLT] getPonPorts failed, using mock data:', err.message);
    return mockData.ponPorts;
  }
}

async function getGePorts() {
  try {
    if (config.USE_SSH) return mockData.gePorts;
    const ifaces = await getIfTableSNMP();
    const ports = await getGePortsSNMP(ifaces);
    return ports.length ? ports : mockData.gePorts;
  } catch (err) {
    console.warn('[OLT] getGePorts failed, using mock data:', err.message);
    return mockData.gePorts;
  }
}

async function getOnus() {
  try {
    if (config.USE_SSH) return await getOnusSSH();
    // SNMP ONU list needs vendor-specific OIDs; fall back to mock
    return mockData.onus;
  } catch (err) {
    console.warn('[OLT] getOnus failed, using mock data:', err.message);
    return mockData.onus;
  }
}

async function getOnuTraffic() {
  try {
    // Traffic counters require vendor-specific SNMP OIDs or SSH
    // Returning mock data until vendor OIDs are configured
    return mockData.onuTraffic;
  } catch (err) {
    console.warn('[OLT] getOnuTraffic failed, using mock data:', err.message);
    return mockData.onuTraffic;
  }
}

async function getOnuConfigs() {
  try {
    return mockData.onuConfigs;
  } catch (err) {
    console.warn('[OLT] getOnuConfigs failed, using mock data:', err.message);
    return mockData.onuConfigs;
  }
}

module.exports = {
  getOltInfo,
  getPonPorts,
  getGePorts,
  getOnus,
  getOnuTraffic,
  getOnuConfigs,
};
