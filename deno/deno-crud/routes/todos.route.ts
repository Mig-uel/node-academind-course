import { Router } from 'https://deno.land/x/oak/mod.ts'
import { Document, ObjectId } from 'https://deno.land/x/mongo@v0.32.0/mod.ts'
import { getDB } from '../utils/db_client.helpers.ts'

const router = new Router()

interface ITodo {
  id?: string
  text: string
}

let todos: ITodo[] = []

router.get('/', async (ctx) => {
  const todos = await getDB().collection('todos').find().toArray()

  const todosArray = todos.map((todo: Document) => {
    return { id: todo._id.toString(), text: todo.text }
  })

  const { response } = ctx
  response.body = { todos: todosArray }
})

router.post('/', async (ctx) => {
  const { response } = ctx
  const { text } = await ctx.request.body.json()

  const todo: ITodo = { text }

  const id = await getDB().collection('todos').insertOne(todo)

  todo.id = id.toString()

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
