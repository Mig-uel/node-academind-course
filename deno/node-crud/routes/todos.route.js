const { Router } = require('express')

const router = Router()

// todos
let todos = []

router.get('/', (req, res) => res.status(200).json({ todos }))

router.post('/', (req, res) => {
  const { text } = req.body

  todos.push({ id: new Date().getTime(), text })

  return res.status(200).json({ message: 'todo added', todos })
})

router.patch('/:id', (req, res) => {})

router.delete('/:id', (req, res) => {})

module.exports = router
