// middleware
const { check } = require('express-validator')
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
  .post(
    isAuthenticated,
    [
      check('title', 'Invalid title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),
      check('price', 'Invalid price').isFloat(),
      check('description', 'Description is invalid')
        .trim()
        .isLength({ min: 8, max: 400 }),
    ],
    addProduct
  )
adminRouter
  .route('/edit/:id')
  .get(isAuthenticated, getEditProductForm)
  .patch(
    isAuthenticated,
    [
      check('title', 'Invalid title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),
      check('price', 'Invalid price').isFloat(),
      check('description', 'Description is invalid')
        .trim()
        .isLength({ min: 8, max: 400 }),
    ],
    editProduct
  )
adminRouter.route('/delete').delete(isAuthenticated, deleteProduct)

module.exports = { adminRouter }
