const path = require('path')
const adminRouter = require('express').Router()

adminRouter
  .route('/product')
  .get((req, res) => {
    return res
      .status(200)
      .sendFile(path.join(__dirname, '..', 'views', 'add-product.html'))
  })
  .post((req, res) => {
    const { body } = req
    console.log(body)

    return res.send('<h1>Product Added!</h1>')
  })

module.exports = { adminRouter }
