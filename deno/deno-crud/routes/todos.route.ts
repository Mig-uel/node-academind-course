import { Router } from 'https://deno.land/x/oak/mod.ts'

const router = new Router()

interface ITodo {
  id: string
  text: string
}

let todos: ITodo[] = []

router.get('/', (ctx) => {
  const { response } = ctx
  response.body = { todos }
})

router.post('/', async (ctx) => {
  const { response } = ctx
  const { text } = await ctx.request.body.json()

  const todo: ITodo = { id: new Date().toISOString(), text }

  todos.push(todo)

  response.body = { message: 'created todo', todo }
})

router.patch('/:id', async (ctx) => {
  const { id } = ctx.params
  const { response } = ctx
  const { text } = await ctx.request.body.json()

  const index = todos.findIndex((todo) => todo.id === id)

  if (!index) response.body = { error: 'todo not found' }

  todos[index] = { ...todos[index], text }

  response.body = { message: 'todo updated', todos }
})

router.delete('/:id', (ctx) => {
  const { id } = ctx.params
  const { response } = ctx

  todos = todos.filter((todo) => todo.id !== id)
  response.body = { message: 'todo deleted', todos }
})

export default router
