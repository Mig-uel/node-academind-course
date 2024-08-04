const express = require('express')

const PORT = 8080
const app = express()

// routers
const feedRouter = require('./routes/feed.route')

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/feed', feedRouter)

app.listen(PORT, () => {
  console.log('Server is running...')
})
