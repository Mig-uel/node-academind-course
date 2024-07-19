const mysql = require('mysql2')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'shop',
  password: 'mysqladmin',
})

module.exports = { db: db.promise() }
