const adminRouter = require('express').Router()

adminRouter
  .route('/product')
  .get((req, res) => {
    return res.status(200).send(
      `<form action="/admin/product" method="POST">
        <input type="text" name="title" required/>
        <button type="submit">Add Product</button>
      </form>`
    )
  })
  .post((req, res) => {
    const { body } = req
    console.log(body)

    return res.send('<h1>Product Added!</h1>')
  })

module.exports = { adminRouter }
