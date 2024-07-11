const express = require('express')

const PORT = 3000
const app = express()

// routes
app.get('/', (req, res) => {
  res.status(200)
  return res.send(`<h1>Current URL: ${req.url}</h1>`)
})

app.get('/users', (req, res) => {
  return res.status(200).send(`<h1>Current URL: ${req.url}</h1>`)
})

app.use((req, res) => {
  res.status(404).send(`<h1>${req.url} does not exist...</h1>`)
})

app.listen(PORT, (req, res) => {
  console.log(`SERVER RUNNING ON PORT: ${PORT}`)
})
