require('dotenv').config();

module.exports = {
  // OLT connection settings
  OLT_IP: process.env.OLT_IP || '192.168.1.1',
  OLT_NAME: process.env.OLT_NAME || 'Hioso OLT-8X',
  OLT_LOCATION: process.env.OLT_LOCATION || 'Data Center A',
  OLT_MODEL: process.env.OLT_MODEL || 'OLT-8X-PON',

  // SNMP settings
  SNMP_COMMUNITY: process.env.SNMP_COMMUNITY || 'public',
  SNMP_VERSION: parseInt(process.env.SNMP_VERSION || '1', 10), // 1 = v2c
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

  // API server port
  API_PORT: parseInt(process.env.API_PORT || '5000', 10),
};
