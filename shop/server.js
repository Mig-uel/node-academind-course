// core modules
const path = require('path')

// dev
require('colors')
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

// db
const { db } = require('./utils/db.utils')
const User = require('./models/user.models')

// router
const { adminRouter } = require('./routes/admin.routes')
const { shopRouter } = require('./routes/shop.routes')
const { authRouter } = require('./routes/auth.routes')
const { use404 } = require('./controllers/error.controller')

// config
const app = express()
const port = process.env.PORT || 4000
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
})
db()

// express setup
app.set('view engine', 'ejs') // set view engine
app.set('views', 'views') // already default, just example

// middleware

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: 'strict',
    },
    store,
  })
)
app.use(async (req, res, next) => {
  const user = await User.findById('66a02ed53e6b9281c2e26289')

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

// routes\
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/', shopRouter)

// 404
app.use(use404)

mongoose.connection.once('open', () => {
  // start express server
  app.listen(port, async () => {
    console.log(`SERVER RUNNING ON PORT: ${port}`.green.inverse)
  })
})

mongoose.connection.on('error', (error) => {
  console.log(error)
})
