const path = require('path')

const shopRouter = require('express').Router()
const {
  getHome,
  getProducts,
  getCart,
  getCheckout,
} = require('../controllers/shop.controller')

shopRouter.route('/').get(getHome)
shopRouter.route('/products').get(getProducts)
shopRouter.route('/cart').get(getCart)
shopRouter.route('/checkout').get(getCheckout)

module.exports = { shopRouter }
