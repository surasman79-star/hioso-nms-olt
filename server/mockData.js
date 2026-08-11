// Server-side mirror of frontend mock data
// Used as fallback when OLT is not reachable

const oltInfo = {
  name: 'Hioso OLT-8X',
  ip: '192.168.1.1',
  location: 'Data Center A',
  uptime: '45d 12h 33m',
  model: 'OLT-8X-PON',
  firmware: 'v2.3.1',
  totalPon: 8,
  totalGe: 4,
  totalOnu: 128,
  onlineOnu: 112,
};

const ponPorts = [
  { id: 1, name: 'PON 0/1', status: 'up',   onuCount: 16, maxOnu: 128, bandwidth: '10G', rxPower: -18.5, txPower: 3.2 },
  { id: 2, name: 'PON 0/2', status: 'up',   onuCount: 14, maxOnu: 128, bandwidth: '10G', rxPower: -19.1, txPower: 3.1 },
  { id: 3, name: 'PON 0/3', status: 'up',   onuCount: 20, maxOnu: 128, bandwidth: '10G', rxPower: -17.8, txPower: 3.3 },
  { id: 4, name: 'PON 0/4', status: 'up',   onuCount: 18, maxOnu: 128, bandwidth: '10G', rxPower: -20.2, txPower: 3.0 },
  { id: 5, name: 'PON 0/5', status: 'up',   onuCount: 12, maxOnu: 128, bandwidth: '10G', rxPower: -18.9, txPower: 3.2 },
  { id: 6, name: 'PON 0/6', status: 'up',   onuCount: 15, maxOnu: 128, bandwidth: '10G', rxPower: -19.5, txPower: 3.1 },
  { id: 7, name: 'PON 0/7', status: 'down', onuCount: 0,  maxOnu: 128, bandwidth: '10G', rxPower: null,  txPower: null },
  { id: 8, name: 'PON 0/8', status: 'up',   onuCount: 17, maxOnu: 128, bandwidth: '10G', rxPower: -18.3, txPower: 3.4 },
];

const gePorts = [
  { id: 1, name: 'GE 0/1', status: 'up',   speed: '1000M', duplex: 'Full', inTraffic: '524 Mbps', outTraffic: '312 Mbps', role: 'Uplink' },
  { id: 2, name: 'GE 0/2', status: 'up',   speed: '1000M', duplex: 'Full', inTraffic: '210 Mbps', outTraffic: '98 Mbps',  role: 'Uplink' },
  { id: 3, name: 'GE 0/3', status: 'down', speed: '---',   duplex: '---',  inTraffic: '0 Mbps',   outTraffic: '0 Mbps',   role: 'Management' },
  { id: 4, name: 'GE 0/4', status: 'up',   speed: '100M',  duplex: 'Full', inTraffic: '45 Mbps',  outTraffic: '22 Mbps',  role: 'Management' },
];

const onus = [
  { id: 'ONU-01-001', ponPort: 'PON 0/1', slot: 1, onuId: 1, serialNumber: 'HTXH0001A1B2', mac: 'AA:BB:CC:DD:01:01', type: 'HG8240H', status: 'online',  distance: 1.2, rxPower: -18.5, txPower: 2.5, uptime: '30d 4h',  description: 'Pelanggan A - Gedung Utama' },
  { id: 'ONU-01-002', ponPort: 'PON 0/1', slot: 1, onuId: 2, serialNumber: 'HTXH0001C3D4', mac: 'AA:BB:CC:DD:01:02', type: 'HG8245H', status: 'online',  distance: 2.1, rxPower: -19.2, txPower: 2.4, uptime: '25d 10h', description: 'Pelanggan B' },
  { id: 'ONU-01-003', ponPort: 'PON 0/1', slot: 1, onuId: 3, serialNumber: 'HTXH0001E5F6', mac: 'AA:BB:CC:DD:01:03', type: 'HG8240H', status: 'offline', distance: 3.5, rxPower: null,  txPower: null, uptime: '---',     description: 'Pelanggan C' },
  { id: 'ONU-02-001', ponPort: 'PON 0/2', slot: 2, onuId: 1, serialNumber: 'HTXH0002A1B2', mac: 'AA:BB:CC:DD:02:01', type: 'HG8245H', status: 'online',  distance: 1.8, rxPower: -17.9, txPower: 2.6, uptime: '15d 2h',  description: 'Pelanggan D' },
  { id: 'ONU-02-002', ponPort: 'PON 0/2', slot: 2, onuId: 2, serialNumber: 'HTXH0002C3D4', mac: 'AA:BB:CC:DD:02:02', type: 'HG8240H', status: 'online',  distance: 4.2, rxPower: -20.1, txPower: 2.3, uptime: '20d 8h',  description: 'Pelanggan E' },
  { id: 'ONU-03-001', ponPort: 'PON 0/3', slot: 3, onuId: 1, serialNumber: 'HTXH0003A1B2', mac: 'AA:BB:CC:DD:03:01', type: 'HG8245H', status: 'online',  distance: 2.5, rxPower: -18.7, txPower: 2.5, uptime: '40d 1h',  description: 'Pelanggan F - Tower' },
  { id: 'ONU-03-002', ponPort: 'PON 0/3', slot: 3, onuId: 2, serialNumber: 'HTXH0003C3D4', mac: 'AA:BB:CC:DD:03:02', type: 'HG8240H', status: 'online',  distance: 1.1, rxPower: -17.5, txPower: 2.7, uptime: '12d 6h',  description: 'Pelanggan G' },
  { id: 'ONU-04-001', ponPort: 'PON 0/4', slot: 4, onuId: 1, serialNumber: 'HTXH0004A1B2', mac: 'AA:BB:CC:DD:04:01', type: 'HG8245H', status: 'online',  distance: 3.0, rxPower: -19.8, txPower: 2.4, uptime: '8d 14h',  description: 'Pelanggan H' },
  { id: 'ONU-04-002', ponPort: 'PON 0/4', slot: 4, onuId: 2, serialNumber: 'HTXH0004C3D4', mac: 'AA:BB:CC:DD:04:02', type: 'HG8240H', status: 'offline', distance: 5.1, rxPower: null,  txPower: null, uptime: '---',     description: 'Pelanggan I' },
];

const onuTraffic = [
  { id: 'ONU-01-001', ponPort: 'PON 0/1', description: 'Pelanggan A - Gedung Utama', upstream: '42.5', downstream: '125.3', upstreamUtil: '42.5', downstreamUtil: '62.7', txBytes: '524288',  rxBytes: '2621440' },
  { id: 'ONU-01-002', ponPort: 'PON 0/1', description: 'Pelanggan B',                upstream: '18.0', downstream: '64.8',  upstreamUtil: '18.0', downstreamUtil: '32.4', txBytes: '188416',  rxBytes: '679936' },
  { id: 'ONU-02-001', ponPort: 'PON 0/2', description: 'Pelanggan D',                upstream: '55.2', downstream: '180.6', upstreamUtil: '55.2', downstreamUtil: '72.2', txBytes: '578560',  rxBytes: '1892352' },
  { id: 'ONU-02-002', ponPort: 'PON 0/2', description: 'Pelanggan E',                upstream: '9.7',  downstream: '35.1',  upstreamUtil: '9.7',  downstreamUtil: '17.6', txBytes: '101888',  rxBytes: '368640' },
  { id: 'ONU-03-001', ponPort: 'PON 0/3', description: 'Pelanggan F - Tower',        upstream: '72.4', downstream: '210.0', upstreamUtil: '72.4', downstreamUtil: '84.0', txBytes: '759808',  rxBytes: '2201600' },
  { id: 'ONU-03-002', ponPort: 'PON 0/3', description: 'Pelanggan G',                upstream: '31.6', downstream: '95.4',  upstreamUtil: '31.6', downstreamUtil: '47.7', txBytes: '331776',  rxBytes: '1001472' },
  { id: 'ONU-04-001', ponPort: 'PON 0/4', description: 'Pelanggan H',                upstream: '24.8', downstream: '78.9',  upstreamUtil: '24.8', downstreamUtil: '39.5', txBytes: '260096',  rxBytes: '827392' },
];

const onuConfigs = [
  { id: 'ONU-01-001', serialNumber: 'HTXH0001A1B2', ponPort: 'PON 0/1', description: 'Pelanggan A - Gedung Utama', type: 'HG8240H', vlan: 101, profile: 'Paket 10Mbps', pppoeUser: 'user_htxh0001a1b2', gemPort: 1, tcontId: 1, bandwidthProfile: '10M/10M', adminStatus: 'enable' },
  { id: 'ONU-01-002', serialNumber: 'HTXH0001C3D4', ponPort: 'PON 0/1', description: 'Pelanggan B',                type: 'HG8245H', vlan: 102, profile: 'Paket 10Mbps', pppoeUser: 'user_htxh0001c3d4', gemPort: 2, tcontId: 1, bandwidthProfile: '10M/10M', adminStatus: 'enable' },
  { id: 'ONU-01-003', serialNumber: 'HTXH0001E5F6', ponPort: 'PON 0/1', description: 'Pelanggan C',                type: 'HG8240H', vlan: 103, profile: 'Paket 10Mbps', pppoeUser: 'user_htxh0001e5f6', gemPort: 3, tcontId: 1, bandwidthProfile: '10M/10M', adminStatus: 'disable' },
  { id: 'ONU-02-001', serialNumber: 'HTXH0002A1B2', ponPort: 'PON 0/2', description: 'Pelanggan D',                type: 'HG8245H', vlan: 201, profile: 'Paket 20Mbps', pppoeUser: 'user_htxh0002a1b2', gemPort: 1, tcontId: 2, bandwidthProfile: '20M/20M', adminStatus: 'enable' },
  { id: 'ONU-02-002', serialNumber: 'HTXH0002C3D4', ponPort: 'PON 0/2', description: 'Pelanggan E',                type: 'HG8240H', vlan: 202, profile: 'Paket 20Mbps', pppoeUser: 'user_htxh0002c3d4', gemPort: 2, tcontId: 2, bandwidthProfile: '20M/20M', adminStatus: 'enable' },
  { id: 'ONU-03-001', serialNumber: 'HTXH0003A1B2', ponPort: 'PON 0/3', description: 'Pelanggan F - Tower',        type: 'HG8245H', vlan: 301, profile: 'Paket 50Mbps', pppoeUser: 'user_htxh0003a1b2', gemPort: 1, tcontId: 3, bandwidthProfile: '50M/50M', adminStatus: 'enable' },
  { id: 'ONU-03-002', serialNumber: 'HTXH0003C3D4', ponPort: 'PON 0/3', description: 'Pelanggan G',                type: 'HG8240H', vlan: 302, profile: 'Paket 50Mbps', pppoeUser: 'user_htxh0003c3d4', gemPort: 2, tcontId: 3, bandwidthProfile: '50M/50M', adminStatus: 'enable' },
  { id: 'ONU-04-001', serialNumber: 'HTXH0004A1B2', ponPort: 'PON 0/4', description: 'Pelanggan H',                type: 'HG8245H', vlan: 401, profile: 'Paket 20Mbps', pppoeUser: 'user_htxh0004a1b2', gemPort: 1, tcontId: 2, bandwidthProfile: '20M/20M', adminStatus: 'enable' },
  { id: 'ONU-04-002', serialNumber: 'HTXH0004C3D4', ponPort: 'PON 0/4', description: 'Pelanggan I',                type: 'HG8240H', vlan: 402, profile: 'Paket 20Mbps', pppoeUser: 'user_htxh0004c3d4', gemPort: 2, tcontId: 2, bandwidthProfile: '20M/20M', adminStatus: 'disable' },
];

module.exports = { oltInfo, ponPorts, gePorts, onus, onuTraffic, onuConfigs };
