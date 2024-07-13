const path = require('path')
const express = require('express')

const app = express()

// middleware
app.use(express.static(path.join(__dirname, 'public'))) // public folder

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/random', (req, res) => {
  return res.sendFile(path.join(__dirname, 'views', 'random.html'))
})

app.listen(3500, (req, res) => {
  console.log('Express Assignment 2 - Running...')
})
