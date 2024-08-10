import express from 'express'

// routes
import todosRouter from './routes/todos.route'

const app = express()
const port = 8080

app.use(express.json())

app.use('/todos', todosRouter)

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT: ${port}`)
})
