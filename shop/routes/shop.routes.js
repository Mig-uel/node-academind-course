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
  getCheckout,
  getProduct,
  removeFromCart,
  getInvoice,
  addOrder,
  getSuccess,
  getCancel,
} = require('../controllers/shop.controller')

shopRouter.route('/').get(getHome)
shopRouter.route('/products').get(getProducts)
shopRouter.route('/products/:id').get(getProduct)
shopRouter
  .route('/cart')
  .get(isAuthenticated, getCart)
  .post(isAuthenticated, addToCart)
  .delete(isAuthenticated, removeFromCart)

// checkout flow
shopRouter.route('/checkout').get(isAuthenticated, getCheckout)
shopRouter.route('/checkout/success').get(getSuccess)
shopRouter.route('/checkout/cancel').get(getCancel)

// orders
shopRouter.route('/orders').get(isAuthenticated, getOrders)
shopRouter.route('/orders/add').get(isAuthenticated, addOrder)
shopRouter.route('/orders/:orderId').get(isAuthenticated, getInvoice)

module.exports = { shopRouter }
