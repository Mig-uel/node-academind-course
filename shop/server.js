const express = require('express')
require('colors')

// router
const { adminRouter } = require('./routes/admin.routes')
const { shopRouter } = require('./routes/shop.routes')

// config
const PORT = 3000
const app = express()

// middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] - ${req.url} - ${res.statusCode}`.yellow.inverse)
  next()
}) // method - url - status
app.use(express.urlencoded({ extended: true })) // parse form data
app.use(express.json()) // parse json data

// routes
app.use(adminRouter)
app.use(shopRouter)

// 404 - not found
app.use((req, res, next) => res.redirect(302, '/'))

// server
app.listen(PORT, (req, res) => {
  console.log(`SERVER RUNNING ON PORT: ${PORT}`.green.inverse)
})
