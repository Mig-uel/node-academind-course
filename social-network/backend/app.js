require('dotenv').config({ path: '../.env' })
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const { storage, fileFilter } = require('./utils/multerOptions.utils')
const { errorHandler } = require('./middleware/errorHandler.middleware')
const { connectToDatabase } = require('./utils/db.utils')

const port = process.env.PORT || 4000
const app = express()

// routers
const feedRouter = require('./routes/feed.route')
const authRouter = require('./routes/auth.route')

// serve static files
app.use('/images', express.static('images')) // virtual path: /images

// body parser middleware
app.use(express.json())
app.use(multer({ storage, fileFilter }).single('image'))

// cors middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// routes
app.use('/feed', feedRouter)
app.use('/auth', authRouter)

// error handler
app.use(errorHandler)

// connect to database
connectToDatabase()

mongoose.connection.once('open', () => {
  // start express server
  app.listen(port, async () => {
    console.log(' x - - - - - - - - - - - - x')
    console.log(`SERVER RUNNING ON PORT: ${port}`)
    console.log(' x - - - - - - - - - - - - x')
  })
})

mongoose.connection.on('error', (error) => {
  console.log(error)
})
