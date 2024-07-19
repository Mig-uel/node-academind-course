const mysql = require('mysql2')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('shop', 'root', 'mysqladmin', {
  host: 'localhost',
  dialect: 'mssql',
})

module.exports = { sequelize }
