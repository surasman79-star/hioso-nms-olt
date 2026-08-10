const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OLT = sequelize.define('OLT', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    hostname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    snmp_community: {
      type: DataTypes.STRING,
      defaultValue: 'public'
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('online', 'offline', 'maintenance'),
      defaultValue: 'offline'
    },
    last_sync: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true
  });

  return OLT;
};
