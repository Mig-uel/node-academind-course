const express = require('express')

const PORT = 8080
const app = express()

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log('Server is running...')
})
