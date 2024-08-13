import { Application } from 'https://deno.land/x/oak@v16.1.0/mod.ts'

// router
import todosRouter from './routes/todos.route.ts'

const app = new Application()

// middleware
app.use(async (ctx, next) => {
  console.log('Middleware!')
  await next()
})

// set cors policy
app.use(async (ctx, next) => {
  const { response } = ctx

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE'
  )
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

  await next()
})

// routes
app.use(todosRouter.routes())
app.use(todosRouter.allowedMethods())

await app.listen({ port: 4000 })
