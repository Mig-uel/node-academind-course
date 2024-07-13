const adminRouter = require('express').Router()

adminRouter.route('/add-product').get((req, res) => {
  return res.status(200).send(
    `<form action="/product" method="POST">
        <input type="text" name="title" required/>
        <button type="submit">Add Product</button>
      </form>`
  )
})

adminRouter.route('/product').post((req, res) => {
  const { body } = req
  console.log(body)

  return res.redirect(302, '/')
})

module.exports = { adminRouter }
