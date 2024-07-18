const path = require('path')

const {
  getAddProductForm,
  addProduct,
  adminGetProducts,
  getEditProductForm,
} = require('../controllers/admin.controller')
const adminRouter = require('express').Router()

adminRouter.route('/products').get(adminGetProducts)
adminRouter.route('/products/add').get(getAddProductForm).post(addProduct)
adminRouter.route('/edit/:id').get(getEditProductForm)

module.exports = { adminRouter }
