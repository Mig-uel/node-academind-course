const shopRouter = require('express').Router()

shopRouter.route('/').get((req, res) => {
  res.send('<h1>Shop</h1>')
})

module.exports = { shopRouter }
