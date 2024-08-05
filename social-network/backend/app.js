require('dotenv').config({ path: '../.env' })
const express = require('express')

const port = process.env.PORT || 3000
const app = express()

// routers
const feedRouter = require('./routes/feed.route')

// body parser middleware
app.use(express.json())

// cors middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// routes
app.use('/feed', feedRouter)

app.listen(PORT, () => {
  console.log('Server is running...')
})
