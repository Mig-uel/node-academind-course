require('dotenv').config({ path: '../.env' })
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const { storage, fileFilter } = require('./utils/multerOptions.utils')
const { errorHandler } = require('./middleware/errorHandler.middleware')
const { connectToDatabase } = require('./utils/db.utils')

// graphql
const { createHandler } = require('graphql-http/lib/use/express') // graphql handler
const { ruruHTML } = require('ruru/server') // graphql ide
const graphQLSchema = require('./graphql/schema') // graphql schema
const { root } = require('./graphql/resolvers') // graphql resolvers

const port = process.env.PORT || 4000
const app = express()

// serve static files
app.use('/images', express.static('images')) // virtual path: /images

// body parser middleware
app.use(express.json())
app.use(multer({ storage, fileFilter }).single('image'))

// cors middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// graphql ide endpoint
app.use('/ruru', (req, res) => {
  res.type('html')
  return res.end(ruruHTML({ endpoint: '/graphql' }))
})

// graphql-http config
app.all('/graphql', (req, res) => {
  return createHandler({
    schema: graphQLSchema,
    rootValue: root,
    context: { req, res },
  })(req, res)
})

// error handler
app.use(errorHandler)

// connect to database
connectToDatabase()

mongoose.connection.once('open', () => {
  // start express server
  app.listen(port, async () => {
    console.log(' x - - - - - - - - - - - - x')
    console.log(`SERVER RUNNING ON PORT: ${port}`)
    console.log(' x - - - - - - - - - - - - x')
  })
})

mongoose.connection.on('error', (error) => {
  console.log(error)
})
