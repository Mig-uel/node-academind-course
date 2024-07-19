const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db.utils')

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
})

module.exports = CartItem
