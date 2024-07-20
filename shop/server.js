// core modules
const path = require('path')

require('colors')
const express = require('express')
const methodOverride = require('method-override')

// db

// router
const { adminRouter } = require('./routes/admin.routes')
const { shopRouter } = require('./routes/shop.routes')
const { use404 } = require('./controllers/error.controller')

// config
const PORT = 3000
const app = express()
app.set('view engine', 'ejs') // set view engine
app.set('views', 'views') // already default, just example

// middleware
app.use(async (req, res, next) => {
  req.user = await User.findByPk(1)
  next()
})
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public'))) // server static files/grant access (public folder)
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  console.log(`[${req.method}] - ${req.url} - ${res.statusCode}`.yellow)
  next()
}) // method - url - status
app.use(express.urlencoded({ extended: true })) // parse form data
app.use(express.json()) // parse json data

// routes
app.use('/admin', adminRouter)
app.use(shopRouter)

// 404
app.use(use404)

// start express server
const init = async () => {
  try {
    // server
    app.listen(PORT, (req, res) => {
      console.log(`SERVER RUNNING ON PORT: ${PORT}`.green.inverse)
    })
  } catch (error) {
    console.log(error)
  }
}

init()
