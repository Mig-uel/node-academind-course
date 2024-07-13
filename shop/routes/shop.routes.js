const path = require('path')

const shopRouter = require('express').Router()
const { products } = require('./admin.routes')

shopRouter.route('/').get((req, res) => {
  res.render('shop', { products, docTitle: 'Shop' })
})

module.exports = { shopRouter }
