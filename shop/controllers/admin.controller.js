const Product = require('../models/product.model')

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

  try {
    const product = await Product.create({
      title,
      price,
      imageUrl,
      description,
    })

    if (!product) throw new Error()

    return res.redirect('/admin/products')
  } catch (error) {
    return res.send(`Error: ${error.message}`)
  }
}

const getEditProductForm = async (req, res) => {
  const { id } = req.params

  const product = await Product.findById(id)

  if (typeof product === 'string') return res.send(`<h1>${product}</h1>`)

  return res.render('admin/edit-product', {
    product,
    docTitle: `Edit ${product.title}`,
    path: '/admin/products',
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
