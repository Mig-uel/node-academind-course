const path = require('path')
const shopRouter = require('express').Router()

shopRouter.route('/').get((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'))
})

module.exports = { shopRouter }
