const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db.utils')

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
})

module.exports = Cart
