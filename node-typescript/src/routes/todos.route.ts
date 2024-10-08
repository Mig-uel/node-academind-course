import { Router, Request } from 'express'

// models
import { ITodo } from '../models/todos.controller'

type CustomRequest = Request<{ id: number }, any, { text: string }, any>

let todos: ITodo[] = []

const router = Router()

router.get('/', (req, res, next) => {
  return res.status(200).json({ todos })
})

router.post('/', (req: CustomRequest, res, next) => {
  const { text } = req.body

  const newTodo: ITodo = { id: new Date().getTime(), text }

  todos.push(newTodo)

  return res.status(201).json({ message: 'Todo added!', todos })
})

router.patch('/:id', (req: CustomRequest, res, next) => {
  const { id } = req.params
  const { text } = req.body

  const todoIndex = todos.findIndex((todo) => todo.id === +id)
  if (!todoIndex) return res.status(404).json({ error: 'Todo not found.' })

  todos[todoIndex] = { ...todos[todoIndex], text }

  return res.status(200).json({ message: 'Updated todo.', todos })
})

router.delete('/delete/:id', (req: CustomRequest, res, next) => {
  const { id } = req.params

  const todo = todos.find((todo) => todo.id === +id)
  if (!todo) return res.status(404).json({ error: 'Todo not found.' })

  todos = todos.filter((todo) => todo.id !== +id)
})

export default router
