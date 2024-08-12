import { Application } from 'https://deno.land/x/oak/mod.ts'

// router
import todosRouter from './routes/todos.route.ts'

const app = new Application()

// middleware
// app.use((ctx) => {
//   ctx.response.body = 'Hello, world!'
// })

// routes
app.use(todosRouter.routes)
app.use(todosRouter.allowedMethods())

await app.listen({ port: 3000 })
