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
const { doubleCsrf: csrf } = require('csrf-csrf')
const cookieParser = require('cookie-parser')
const { hydrateUser, csrfMiddleware } = require('./middleware/auth.middleware')

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
const csrfProtection = csrf({
  getSecret: () => process.env.CSRF_SECRET,
  getTokenFromRequest: (req) => req.body._csrf,
})
db()

// express setup
app.set('view engine', 'ejs') // set view engine
app.set('views', 'views') // already default, just example

// middleware
app.use(cookieParser(process.env.CSRF_SECRET))
app.use(csrfProtection.doubleCsrfProtection)
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
app.use(hydrateUser)
app.use(csrfMiddleware)
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
