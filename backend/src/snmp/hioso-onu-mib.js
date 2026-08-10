// HIOSO ONU MIB OID Definitions
// Based on the SNMP discovery scripts provided

const HIOSO_ONU_MIB = {
  // Base OIDs for HIOSO ONU monitoring
  STAT_ONU_BASE: '1.3.6.1.4.1.45996.1.2.1.1.1', // ONU Status Table
  OPTICAL_ONU_BASE: '1.3.6.1.4.1.45996.1.2.1.1.2', // ONU Optical Parameters
  CFG_ONU_BASE: '1.3.6.1.4.1.45996.1.2.1.1.3',   // ONU Configuration
  
  // Column definitions
  COLUMNS: {
    status: {
      STATUS_ONLINE: 1,
      STATUS_OFFLINE: 2,
      STATUS_LOB: 3,
      STATUS_DYING_GASP: 4
    },
    optical: {
      RX_POWER: 1,
      TX_POWER: 2,
      ATTENUATION: 3,
      TEMPERATURE: 4,
      VOLTAGE: 5
    },
    config: {
      SERIAL_NUMBER: 1,
      MAC_ADDRESS: 2,
      MODEL: 3,
      FIRMWARE: 4
    }
  }
};

// Parse OID to extract column and index
function parseOid(oid, baseOid) {
  const baseParts = baseOid.split('.');
  const oidParts = oid.split('.');
  
  if (oidParts.length <= baseParts.length) {
    return { column: null, index: null };
  }

  const column = parseInt(oidParts[baseParts.length]);
  const index = oidParts.slice(baseParts.length + 1).map(p => parseInt(p));

  return { column, index };
}

module.exports = {
  HIOSO_ONU_MIB,
  parseOid
};
