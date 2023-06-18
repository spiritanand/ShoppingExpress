const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: DataTypes.STRING,
});

module.exports = Order;
