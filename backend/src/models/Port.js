const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Port = sequelize.define('Port', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    olt_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    port_type: {
      type: DataTypes.ENUM('ge', 'pon'),
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
    status: {
      type: DataTypes.ENUM('up', 'down'),
      defaultValue: 'down'
    },
    speed: {
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

  return Port;
};
