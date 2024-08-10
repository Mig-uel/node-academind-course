import { Router } from 'express'

// models
import { todos, ITodo } from '../models/todos'

const router = Router()

router.get('/', (req, res, next) => {
  return res.status(200).json({ todos })
})

router.post('/', (req, res, next) => {

  
  const newTodo: ITodo = { id: '1', text: 'neva' }

  todos.push(newTodo)
})

export default router
