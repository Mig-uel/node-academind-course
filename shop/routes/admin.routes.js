// middleware
const { isAuthenticated } = require('../middleware/auth.middleware')

// controllers
const {
  getAddProductForm,
  addProduct,
  adminGetProducts,
  editProduct,
  getEditProductForm,
  deleteProduct,
} = require('../controllers/admin.controller')
const adminRouter = require('express').Router()

adminRouter.route('/products').get(isAuthenticated, adminGetProducts)
adminRouter
  .route('/products/add')
  .get(isAuthenticated, getAddProductForm)
  .post(addProduct)
adminRouter
  .route('/edit/:id')
  .get(isAuthenticated, getEditProductForm)
  .patch(editProduct)
adminRouter.route('/delete').delete(deleteProduct)

module.exports = { adminRouter }
