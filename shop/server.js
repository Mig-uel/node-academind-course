// core modules
const path = require('path')

// dev
require('colors')
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// db
const { db } = require('./utils/db.utils')
const { User } = require('./models/user.models')

// router
const { adminRouter } = require('./routes/admin.routes')
const { shopRouter } = require('./routes/shop.routes')
const { use404 } = require('./controllers/error.controller')

// config
const app = express()
const port = process.env.PORT || 4000
db()

// express setup
app.set('view engine', 'ejs') // set view engine
app.set('views', 'views') // already default, just example

// middleware
app.use(async (req, res, next) => {
  const { user } = await User.findUserById('669bed8506fd67c0e553fca7')

  req.user = user
  next()
})
app.use(express.static('public')) // server static files/grant access (public folder)
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  console.log(`[${req.method}] - ${req.url} - ${res.statusCode}`.yellow)
  next()
}) // method - url - status
app.use(express.urlencoded({ extended: true })) // parse form data
app.use(express.json()) // parse json data

// routes
app.use('/admin', adminRouter)
app.use('/', shopRouter)

// 404
app.use(use404)

mongoose.connection.once('open', () => {
  // start express server
  app.listen(port, () => {
    console.log(`SERVER RUNNING ON PORT: ${port}`.green.inverse)
  })
})

mongoose.connection.on('error', (error) => {
  console.log(error)
})
