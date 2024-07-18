const path = require('path')

const {
  getAddProductForm,
  addProduct,
  adminGetProducts,
} = require('../controllers/admin.controller')
const adminRouter = require('express').Router()

adminRouter.route('/products').get(adminGetProducts)
adminRouter.route('/products/add').get(getAddProductForm).post(addProduct)

module.exports = { adminRouter }
