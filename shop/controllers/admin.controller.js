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
  const { title, imageUrl, description, price } = body

  const product = new Product(title, imageUrl, description, price)
  product.save()

  return res.redirect('/')
}

const getEditProductForm = async (req, res) => {
  const { id } = req.params

  Product.findById(id, (product) => {
    if (!product) return res.send('<h1>Product not found</h1>')

    return res.render('admin/edit-product', {
      product,
      docTitle: `Edit ${product.title}`,
      path: '/admin/products',
    })
  })
}

module.exports = {
  adminGetProducts,
  getAddProductForm,
  addProduct,
  getEditProductForm,
}
