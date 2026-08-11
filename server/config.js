require('dotenv').config();

function parseSnmpVersion(rawValue) {
  const value = String(rawValue ?? '').trim().toLowerCase();
  if (value === '0' || value === '1' || value === 'v1') return 0;
  if (value === '2' || value === '2c' || value === 'v2' || value === 'v2c') return 1;
  if (value === '3' || value === 'v3') return 3;
  return 1;
}

module.exports = {
  // OLT connection settings
  OLT_IP: process.env.OLT_IP || '192.168.1.1',
  OLT_NAME: process.env.OLT_NAME || 'Hioso OLT-8X',
  OLT_LOCATION: process.env.OLT_LOCATION || 'Data Center A',
  OLT_MODEL: process.env.OLT_MODEL || 'OLT-8X-PON',

  // SNMP settings
  SNMP_COMMUNITY: process.env.SNMP_COMMUNITY || 'public',
  SNMP_VERSION: parseSnmpVersion(process.env.SNMP_VERSION || '1'),
  SNMP_PORT: parseInt(process.env.SNMP_PORT || '161', 10),
  SNMP_TIMEOUT: parseInt(process.env.SNMP_TIMEOUT || '5000', 10),
  SNMP_RETRIES: parseInt(process.env.SNMP_RETRIES || '1', 10),

  // SSH/Telnet settings (used when USE_SSH=true)
  USE_SSH: process.env.USE_SSH === 'true',
  SSH_PORT: parseInt(process.env.SSH_PORT || '22', 10),
  SSH_USER: process.env.SSH_USER || 'admin',
  SSH_PASS: process.env.SSH_PASS || '',

  // Polling interval (seconds)
  POLL_INTERVAL: parseInt(process.env.POLL_INTERVAL || '30', 10),

  // Enable fallback to mock data when OLT read fails
  MOCK_FALLBACK: process.env.MOCK_FALLBACK !== 'false',

  // API server port
  API_PORT: parseInt(process.env.API_PORT || '5000', 10),
};
