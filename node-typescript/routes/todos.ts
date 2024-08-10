import { Router } from 'express'

// models
import { todos, ITodo } from '../models/todos'

const router = Router()

router.get('/', (req, res, next) => {
  return res.status(200).json({ todos })
})

router.post('/', (req, res, next) => {
  const { text } = req.body

  const newTodo: ITodo = { id: '1', text }

  todos.push(newTodo)

  return res.status(201).json({message: 'Todo added!'})
})

export default router
