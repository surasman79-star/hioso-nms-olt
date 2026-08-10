const SNMPClient = require('./SNMPClient');
const { HIOSO_ONU_MIB, parseOid } = require('./hioso-onu-mib');
const logger = require('../utils/logger');
const { OLT, ONU, ONUOptical, Port, TrafficData } = require('../models');

class SNMPPoller {
  constructor(host = process.env.SNMP_HOST, community = process.env.SNMP_COMMUNITY) {
    this.snmp = new SNMPClient(host, community);
    this.host = host;
  }

  async pollOnuStatus() {
    try {
      logger.info(`Polling ONU status from ${this.host}`);
      const results = await this.snmp.walk(HIOSO_ONU_MIB.STAT_ONU_BASE);
      
      const grouped = {};
      results.forEach(({ oid, value }) => {
        const { column, index } = parseOid(oid, HIOSO_ONU_MIB.STAT_ONU_BASE);
        if (!grouped[index]) grouped[index] = {};
        grouped[index][column] = value;
      });

      logger.info(`Parsed ${Object.keys(grouped).length} ONU entries`);
      return grouped;
    } catch (error) {
      logger.error('Error polling ONU status:', error);
      return {};
    }
  }

  async pollOnuOptical() {
    try {
      logger.info(`Polling ONU optical data from ${this.host}`);
      const results = await this.snmp.walk(HIOSO_ONU_MIB.OPTICAL_ONU_BASE);
      
      const grouped = {};
      results.forEach(({ oid, value }) => {
        const { column, index } = parseOid(oid, HIOSO_ONU_MIB.OPTICAL_ONU_BASE);
        if (!grouped[index]) grouped[index] = {};
        grouped[index][column] = value;
      });

      logger.info(`Parsed optical data for ${Object.keys(grouped).length} ONUs`);
      return grouped;
    } catch (error) {
      logger.error('Error polling ONU optical data:', error);
      return {};
    }
  }

  async pollOltData() {
    try {
      const statusData = await this.pollOnuStatus();
      const opticalData = await this.pollOnuOptical();
      
      return { statusData, opticalData };
    } catch (error) {
      logger.error('Error polling OLT data:', error);
      return { statusData: {}, opticalData: {} };
    }
  }
}

module.exports = SNMPPoller;
