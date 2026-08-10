#!/usr/bin/env node
require('dotenv').config();
const SNMPClient = require('../src/snmp/SNMPClient');
const { HIOSO_ONU_MIB, parseOid } = require('../src/snmp/hioso-onu-mib');
const logger = require('../src/utils/logger');

const HOST = process.env.SNMP_HOST || '170.0.232.89';
const COMMUNITY = process.env.SNMP_COMMUNITY || 'public';

async function testSNMPConnection() {
  logger.info(`Testing SNMP connection to ${HOST}`);
  
  const snmp = new SNMPClient(HOST, COMMUNITY);
  
  try {
    // Test 1: Simple GET - System Description
    logger.info('\n=== Test 1: System Description (GET) ===');
    const sysDescr = await snmp.get('1.3.6.1.2.1.1.1.0');
    logger.info(`System Description: ${sysDescr}`);
    
    // Test 2: ONU Status Table WALK
    logger.info('\n=== Test 2: ONU Status Table (WALK) ===');
    const statusResults = await snmp.walk(HIOSO_ONU_MIB.STAT_ONU_BASE);
    logger.info(`Found ${statusResults.length} ONU status entries`);
    statusResults.slice(0, 5).forEach(({oid, value}) => {
      const {column, index} = parseOid(oid, HIOSO_ONU_MIB.STAT_ONU_BASE);
      logger.info(`  OID: ${oid}, Column: ${column}, Index: ${index}, Value: ${value}`);
    });
    
    // Test 3: ONU Optical Table WALK
    logger.info('\n=== Test 3: ONU Optical Table (WALK) ===');
    const opticalResults = await snmp.walk(HIOSO_ONU_MIB.OPTICAL_ONU_BASE);
    logger.info(`Found ${opticalResults.length} optical parameter entries`);
    opticalResults.slice(0, 5).forEach(({oid, value}) => {
      const {column, index} = parseOid(oid, HIOSO_ONU_MIB.OPTICAL_ONU_BASE);
      logger.info(`  OID: ${oid}, Column: ${column}, Index: ${index}, Value: ${value}`);
    });
    
    // Test 4: ONU Config Table WALK
    logger.info('\n=== Test 4: ONU Config Table (WALK) ===');
    const configResults = await snmp.walk(HIOSO_ONU_MIB.CFG_ONU_BASE);
    logger.info(`Found ${configResults.length} configuration entries`);
    configResults.slice(0, 5).forEach(({oid, value}) => {
      const {column, index} = parseOid(oid, HIOSO_ONU_MIB.CFG_ONU_BASE);
      logger.info(`  OID: ${oid}, Column: ${column}, Index: ${index}, Value: ${value}`);
    });
    
    logger.info('\n✅ SNMP Connection Test PASSED');
    
  } catch (error) {
    logger.error('❌ SNMP Connection Test FAILED:');
    logger.error('Error:', error.message);
    logger.error('\nMungkin masalah:');
    logger.error('1. OLT tidak reachable (check IP: ' + HOST + ')');
    logger.error('2. SNMP community string salah (current: ' + COMMUNITY + ')');
    logger.error('3. Firewall blocking SNMP port 161');
    logger.error('4. OID MIB tidak sesuai dengan device HIOSO');
    process.exit(1);
  }
}

testSNMPConnection();
