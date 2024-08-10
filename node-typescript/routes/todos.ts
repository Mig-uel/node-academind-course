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

  return res.status(201).json({ message: 'Todo added!' })
})

router.patch('/:id', (req, res, next) => {
  const { id } = req.params
  const { text } = req.body

  const todoIndex = todos.findIndex((todo) => todo.id === id)
  if (!todoIndex) return res.status(404).json({ error: 'Todo not found.' })

  todos[todoIndex] = { ...todos[todoIndex], text }

  return res.status(200).json({ message: 'Updated todo.', todos })
})

export default router
