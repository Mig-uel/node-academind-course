const { Product } = require('../models/product.model')

const adminGetProducts = async (req, res) => {
  const products = await Product.fetchAllProducts()

  return res.render('admin/admin-product-list', {
    products,
    docTitle: 'Admin All Products',
    path: '/admin/products',
  })
}

const getAddProductForm = async (req, res) => {
  return res.status(200).render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/products/add',
  })
}

const addProduct = async (req, res) => {
  const { title, imageUrl, description, price } = req.body

  const product = new Product(title, imageUrl, description, +price)
  await product.save()

  return res.redirect('/admin/products')
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

const editProduct = async (req, res) => {
  const { title, imageUrl, price, description, id } = req.body

  const updatedProduct = new Product(title, imageUrl, description, price, id)

  updatedProduct.save()

  return res.redirect(`/admin/products`)
}

const deleteProduct = async (req, res) => {
  const { id } = req.body

  Product.deleteById(id)

  res.redirect('/admin/products')
}

module.exports = {
  adminGetProducts,
  getAddProductForm,
  addProduct,
  getEditProductForm,
  editProduct,
  deleteProduct,
}
