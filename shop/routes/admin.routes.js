const path = require('path')

const {
  getAddProductForm,
  addProduct,
  adminGetProducts,
  editProduct,
  getEditProductForm,
  deleteProduct,
} = require('../controllers/admin.controller')
const adminRouter = require('express').Router()

adminRouter.route('/products').get(adminGetProducts)
adminRouter.route('/products/add').get(getAddProductForm).post(addProduct)
adminRouter.route('/edit/:id').get(getEditProductForm).patch(editProduct)
adminRouter.route('/delete').delete(deleteProduct)

module.exports = { adminRouter }
