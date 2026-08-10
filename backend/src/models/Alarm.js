const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alarm = sequelize.define('Alarm', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    olt_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    alarm_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('critical', 'warning', 'info'),
      defaultValue: 'info'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'cleared', 'acknowledged'),
      defaultValue: 'active'
    },
    acknowledged_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true
  });

  return Alarm;
};
