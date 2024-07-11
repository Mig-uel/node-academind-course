const express = require('express')
require('colors')

const PORT = 3000
const app = express()

// middleware
app.use((req, res, next) => {
  console.log(req.url)
  next()
})

// routes
app.get('/', (req, res) => {
  res.status(200)
  return res.send('<h1>Hello, world!</h1>')
})

app.use((req, res, next) => {
  res.status(404)
  return res.send('<h1>Path not found</h1>')
})

// server
app.listen(PORT, (req, res) => {
  console.log(`SERVER RUNNING ON PORT: ${PORT}`.green.inverse)
})
