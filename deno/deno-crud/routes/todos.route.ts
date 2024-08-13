import { Router } from 'https://deno.land/x/oak/mod.ts'
import { Document, ObjectId } from 'https://deno.land/x/mongo@v0.32.0/mod.ts'
import { getDB } from '../utils/db_client.helpers.ts'

const router = new Router()

interface ITodo {
  id?: string
  text: string
}

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
  const { id } = ctx.params!
  const { response } = ctx
  const { text } = await ctx.request.body.json()

  const _todo = await getDB()
    .collection('todos')
    .updateOne({ _id: new ObjectId(id) }, { $set: { text } })

  response.body = { message: 'todo updated' }
})

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params!
  const { response } = ctx

  await getDB()
    .collection('todos')
    .deleteOne({ _id: new ObjectId(id) })

  response.body = { message: 'todo deleted' }
})

export default router
