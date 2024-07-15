const path = require('path')

const {
  getAddProductForm,
  addProduct,
} = require('../controllers/admin.controller')
const adminRouter = require('express').Router()

adminRouter.route('/product').get(getAddProductForm).post(addProduct)

module.exports = { adminRouter }
