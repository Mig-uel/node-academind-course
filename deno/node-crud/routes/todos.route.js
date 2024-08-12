const { Router } = require('express')

const router = Router()

// todos
let todos = []

router.get('/', (req, res) => res.status(200).json({ todos }))

router.post('/', (req, res) => {
  const { text } = req.body

  todos.push({ id: new Date().getTime(), text })

  return res.status(201).json({ message: 'todo added', todos })
})

router.patch('/:id', (req, res) => {
  const { id } = req.params
  const { text } = req.body

  const index = todos.findIndex((todo) => todo.id === id)

  todos[index] = { ...todos[index], text }

  return res.status(200).json({ message: 'todo updated', todos })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params

  todos = todos.filter((todo) => todo.id !== id)

  return res.status(200).json({ message: 'todo deleted', todos })
})

module.exports = router
