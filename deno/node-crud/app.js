const express = require('express')

const app = express()
const port = 3000

// middleware
app.use(express.json())

// routers
const todosRouter = require('./routes/todos.route')

// routes
app.use('/todos', todosRouter)

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT: ${port}`)
})
