import { Application } from 'https://deno.land/x/oak@v16.1.0/mod.ts'

// router
import todosRouter from './routes/todos.route.ts'

const app = new Application()

// middleware
app.use(async (ctx, next) => {
  console.log('Middleware!')
  await next()
})

// routes
app.use(todosRouter.routes())
app.use(todosRouter.allowedMethods())

await app.listen({ port: 4000 })
