const { Product } = require('../models/product.model')

const adminGetProducts = async (req, res) => {
  Product.fetchAll((products) => {
    return res.render('admin/admin-product-list', {
      products,
      docTitle: 'Admin All Products',
      path: '/admin/products',
    })
  })
}

const getAddProductForm = async (req, res) => {
  return res.status(200).render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/products/add',
  })
}

const addProduct = async (req, res) => {
  const { body } = req
  const { title } = body

  const product = new Product(title)
  product.save()

  return res.redirect('/')
}

module.exports = { adminGetProducts, getAddProductForm, addProduct }
