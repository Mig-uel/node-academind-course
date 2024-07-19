const mysql = require('mysql2')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('shop', 'root', 'mysqladmin', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
})

module.exports = { sequelize }
