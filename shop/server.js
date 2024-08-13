// core modules
const path = require('path')

// dev
require('colors')
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const { hydrateUser } = require('./middleware/auth.middleware')

// multer / image uploading
const multer = require('multer')
const { storage, fileFilter } = require('./utils/multer.utils')

// db
const { db } = require('./utils/db.utils')
const User = require('./models/user.models')

// routers
const { adminRouter } = require('./routes/admin.routes')
const { shopRouter } = require('./routes/shop.routes')
const { authRouter } = require('./routes/auth.routes')
const { use404 } = require('./controllers/error.controller')
const { errorHandler } = require('./middleware/error.middleware')

// config
const app = express()
const port = process.env.PORT || 4000
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
})

// express setup
app.set('view engine', 'ejs') // set view engine
app.set('views', 'views') // already default, just example

// middleware
app.use(helmet())
app.use(express.static('public')) // serve static files/grant access (public folder)
app.use('/images', express.static('images')) // serve static files/grant access (images folder)
app.use((req, res, next) => {
  console.log(`[${req.method}] - ${req.url} - ${res.statusCode}`.yellow)
  next()
}) // method - url - status
app.use(express.urlencoded({ extended: true })) // parse form data
app.use(multer({ storage, fileFilter }).single('image')) // parse image data
app.use(express.json()) // parse json data
app.use(methodOverride('_method'))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      sameSite: 'lax',
    },
  })
)

app.use(hydrateUser)

// routes
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/', shopRouter)

// 404
app.use(use404)

// Error handler
app.use(errorHandler)

db()

mongoose.connection.once('open', () => {
  // start express server
  app.listen(port, async () => {
    console.log(`SERVER RUNNING ON PORT: ${port}`.green.inverse)
  })
})

mongoose.connection.on('error', (error) => {
  console.log(error)
})
