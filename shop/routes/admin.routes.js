const path = require('path')
const adminRouter = require('express').Router()

const products = []

adminRouter
  .route('/product')
  .get((req, res) => {
    return res
      .status(200)
      .sendFile(path.join(__dirname, '..', 'views', 'add-product.html'))
  })
  .post((req, res) => {
    const { body } = req
    const { title } = body

    products.push({ title })

    return res.redirect('/')
  })

module.exports = { adminRouter, products }
