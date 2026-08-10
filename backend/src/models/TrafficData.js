const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TrafficData = sequelize.define('TrafficData', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    olt_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    download_mbps: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    upload_mbps: {
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

  return TrafficData;
};
