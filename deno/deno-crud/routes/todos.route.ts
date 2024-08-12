import { Router } from 'https://deno.land/x/oak/mod.ts'

const router = new Router()

interface ITodo {
  id: string
  text: string
}

let todos: ITodo[] = []

router.get('/', (ctx) => {
  ctx.response.body = { todos: todos }
})

router.post('/', (ctx) => {})

router.patch('/:id', (ctx) => {})

router.delete('/:id', (ctx) => {})

export default router
