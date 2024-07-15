const path = require('path')

const shopRouter = require('express').Router()
const { getProducts } = require('../controllers/shop.controller')

shopRouter.route('/').get(getProducts)

module.exports = { shopRouter }
