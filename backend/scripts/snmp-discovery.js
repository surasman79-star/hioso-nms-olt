#!/usr/bin/env node
require('dotenv').config();
const SNMPClient = require('../src/snmp/SNMPClient');
const { HIOSO_ONU_MIB, parseOid } = require('../src/snmp/hioso-onu-mib');
const logger = require('../src/utils/logger');
const fs = require('fs');
const path = require('path');

const HOST = process.env.SNMP_HOST || '170.0.232.89';
const COMMUNITY = process.env.SNMP_COMMUNITY || 'public';

async function discoverOLTData() {
  logger.info(`\n🔍 Starting SNMP MIB Discovery from ${HOST}\n`);
  
  const snmp = new SNMPClient(HOST, COMMUNITY);
  const output = {};
  
  const tables = {
    'status': HIOSO_ONU_MIB.STAT_ONU_BASE,
    'optical': HIOSO_ONU_MIB.OPTICAL_ONU_BASE,
    'config': HIOSO_ONU_MIB.CFG_ONU_BASE
  };

  for (const [tableName, baseOid] of Object.entries(tables)) {
    logger.info(`📊 Walking ${tableName} table: ${baseOid}`);
    const rows = [];
    
    try {
      const results = await snmp.walk(baseOid);
      logger.info(`   Found ${results.length} entries`);
      
      // Group by index for better organization
      const grouped = {};
      results.forEach(({oid, value}) => {
        const {column, index} = parseOid(oid, baseOid);
        const indexKey = index.join('.');
        if (!grouped[indexKey]) grouped[indexKey] = {};
        grouped[indexKey][column] = value;
      });
      
      // Convert to array format
      Object.entries(grouped).forEach(([indexKey, columns]) => {
        rows.push({
          index: indexKey.split('.').map(x => parseInt(x)),
          columns: columns
        });
      });
      
      output[tableName] = {
        base_oid: baseOid,
        total_entries: rows.length,
        rows: rows
      };
      
      logger.info(`   ✅ Successfully parsed ${rows.length} ${tableName} entries\n`);
      
    } catch (error) {
      logger.error(`   ❌ Error walking ${tableName}: ${error.message}\n`);
      output[tableName] = {
        base_oid: baseOid,
        error: error.message,
        rows: []
      };
    }
  }

  // Save to JSON file
  const outputFile = path.join(__dirname, '../hioso-olt-discovery.json');
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');
  logger.info(`\n📁 Discovery results saved to: ${outputFile}`);
  
  // Print summary
  logger.info('\n' + '='.repeat(70));
  logger.info('DISCOVERY SUMMARY');
  logger.info('='.repeat(70));
  Object.entries(output).forEach(([table, data]) => {
    logger.info(`${table.toUpperCase()}: ${data.rows?.length || 0} entries`);
  });
  logger.info('='.repeat(70));
  
  return output;
}

discoverOLTData().catch(err => {
  logger.error('Fatal error:', err);
  process.exit(1);
});
