// core modules
const path = require('path')

require('colors')
const express = require('express')
const methodOverride = require('method-override')

// db
const { sequelize } = require('./utils/db.utils')
const Product = require('./models/product.models')
const User = require('./models/user.models')
const Cart = require('./models/cart.models')
const CartItem = require('./models/cart-item.models')

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

// define relations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

// sequelize sync and start express server
const init = async () => {
  try {
    const res = await sequelize.sync()

    if (!res) throw new Error()

    let user = await User.findByPk(1)

    if (!user) {
      user = await User.create({ name: 'Admin', email: 'admin@email.com' })
    }

    await user.createCart()

    // server
    app.listen(PORT, (req, res) => {
      console.log(`SERVER RUNNING ON PORT: ${PORT}`.green.inverse)
    })
  } catch (error) {
    console.log(error)
  }
}

init()
