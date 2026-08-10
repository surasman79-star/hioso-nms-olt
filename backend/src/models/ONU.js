const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ONU = sequelize.define('ONU', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    olt_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    slot_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    port_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    onu_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mac_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('online', 'offline', 'dying-gasp', 'lob'),
      defaultValue: 'offline'
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_contact: {
      type: DataTypes.STRING,
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

  return ONU;
};
