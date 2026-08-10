const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resource_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resource_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true
  });

  return AuditLog;
};
