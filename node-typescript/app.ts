import express from 'express'

// routes
import todosRouter from './routes/todos'

const app = express()
const port = 8080

app.use('/todos', todosRouter)

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT: ${port}`)
})
