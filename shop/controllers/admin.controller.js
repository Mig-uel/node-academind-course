const Product = require('../models/product.models')

const adminGetProducts = async (req, res) => {
  const { user } = req

  try {
    const products = await user.getProducts()

    if (!products) throw new Error()

    return res.render('admin/admin-product-list', {
      products,
      docTitle: 'Admin All Products',
      path: '/admin/products',
    })
  } catch (error) {
    return res.send(`<h1>Error: ${error.message}</h1>`)
  }
}

const getAddProductForm = async (req, res) => {
  return res.status(200).render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/products/add',
  })
}

const addProduct = async (req, res) => {
  const { title, imageUrl, description, price } = req.body
  const { user } = req

  try {
    const product = await user.createProduct({
      title,
      price,
      imageUrl,
      description,
      userId: user.id,
    })

    if (!product) throw new Error()

    return res.redirect('/admin/products')
  } catch (error) {
    return res.send(`Error: ${error.message}`)
  }
}

const getEditProductForm = async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findByPk(id)

    if (!product) throw new Error()

    return res.render('admin/edit-product', {
      product,
      docTitle: `Edit ${product.title}`,
      path: '/admin/products',
    })
  } catch (error) {
    return res.send(`<h1>${error}</h1>`)
  }
}

const editProduct = async (req, res) => {
  const { title, imageUrl, price, description, id } = req.body

  try {
    const updatedProduct = await Product.findByPk(id)

    updatedProduct.title = title
    updatedProduct.imageUrl = imageUrl
    updatedProduct.price = price
    updatedProduct.description = description

    await updatedProduct.save()

    return res.redirect(`/admin/products`)
  } catch (error) {
    return res.send(`<h1>${error}</h1>`)
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.body

  try {
    const product = await Product.findByPk(id)

    if (!product) throw new Error()

    await product.destroy()

    return res.redirect('/admin/products')
  } catch (error) {
    return res.send(`<h1>${error}</h1>`)
  }
}

module.exports = {
  adminGetProducts,
  getAddProductForm,
  addProduct,
  getEditProductForm,
  editProduct,
  deleteProduct,
}
