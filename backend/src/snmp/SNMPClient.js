const snmp = require('net-snmp');
const logger = require('../utils/logger');

class SNMPClient {
  constructor(host, community = 'public', port = 161, timeout = 5000) {
    this.host = host;
    this.community = community;
    this.port = port;
    this.timeout = timeout;
  }

  async get(oid) {
    return new Promise((resolve, reject) => {
      const session = snmp.createSession(this.host, this.community, { port: this.port, timeout: this.timeout });
      
      session.get([oid], (error, varbinds) => {
        if (error) {
          logger.error(`SNMP GET error for ${oid}:`, error);
          reject(error);
        } else {
          resolve(varbinds[0].value);
        }
        session.close();
      });
    });
  }

  async walk(oid) {
    return new Promise((resolve, reject) => {
      const session = snmp.createSession(this.host, this.community, { port: this.port, timeout: this.timeout });
      const results = [];

      session.subtree(oid, 20, (varbinds) => {
        varbinds.forEach(varbind => {
          if (snmp.isVarbindError(varbind)) {
            logger.warn('SNMP Varbind error:', snmp.varbindError(varbind));
          } else {
            results.push({ oid: varbind.oid, value: varbind.value });
          }
        });
      }, (error) => {
        session.close();
        if (error) {
          logger.error(`SNMP WALK error for ${oid}:`, error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = SNMPClient;
