const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ONUOptical = sequelize.define('ONUOptical', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    onu_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rx_power_dbm: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tx_power_dbm: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    attenuation: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    voltage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    underscored: true
  });

  return ONUOptical;
};
