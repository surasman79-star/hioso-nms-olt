const { Sequelize } = require('sequelize');
const config = require('../config/database');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const User = require('./User')(sequelize);
const OLT = require('./OLT')(sequelize);
const ONU = require('./ONU')(sequelize);
const ONUOptical = require('./ONUOptical')(sequelize);
const Port = require('./Port')(sequelize);
const TrafficData = require('./TrafficData')(sequelize);
const Alarm = require('./Alarm')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);

// Associations
OLT.hasMany(ONU, { foreignKey: 'olt_id', as: 'onus' });
ONU.belongsTo(OLT, { foreignKey: 'olt_id' });

ONU.hasMany(ONUOptical, { foreignKey: 'onu_id', as: 'optical_data' });
ONUOptical.belongsTo(ONU, { foreignKey: 'onu_id' });

OLT.hasMany(Port, { foreignKey: 'olt_id', as: 'ports' });
Port.belongsTo(OLT, { foreignKey: 'olt_id' });

OLT.hasMany(TrafficData, { foreignKey: 'olt_id', as: 'traffic' });
TrafficData.belongsTo(OLT, { foreignKey: 'olt_id' });

OLT.hasMany(Alarm, { foreignKey: 'olt_id', as: 'alarms' });
Alarm.belongsTo(OLT, { foreignKey: 'olt_id' });

module.exports = {
  sequelize,
  User,
  OLT,
  ONU,
  ONUOptical,
  Port,
  TrafficData,
  Alarm,
  AuditLog
};
