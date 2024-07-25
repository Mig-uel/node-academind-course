// middleware
const { isAuthenticated } = require('../middleware/auth.middleware')

// controllers
const shopRouter = require('express').Router()
const {
  getHome,
  getProducts,
  getCart,
  addToCart,
  getOrders,
  addOrder,
  getCheckout,
  getProduct,
  removeFromCart,
} = require('../controllers/shop.controller')

shopRouter.route('/').get(getHome)
shopRouter.route('/products').get(getProducts)
shopRouter.route('/products/:id').get(getProduct)
shopRouter
  .route('/cart')
  .get(isAuthenticated, getCart)
  .post(addToCart)
  .delete(removeFromCart)
shopRouter.route('/checkout').get(isAuthenticated, getCheckout)
shopRouter.route('/orders').get(isAuthenticated, getOrders).post(addOrder)

module.exports = { shopRouter }
