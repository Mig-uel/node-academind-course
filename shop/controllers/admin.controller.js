const Product = require('../models/product.models')

const adminGetProducts = async (req, res) => {
  try {
    const { user } = req.session
    const products = await Product.find({ userId: user })

    return res.render('admin/admin-product-list', {
      products,
      docTitle: 'Admin All Products',
      path: '/admin/products',
      isAuthenticated: req.session.user,
    })
  } catch (error) {
    console.log(error)
  }
}

const getAddProductForm = async (req, res) => {
  return res.status(200).render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/products/add',
    isAuthenticated: req.session.user,
  })
}

const addProduct = async (req, res) => {
  try {
    const { user } = req.session
    const { title, imageUrl, description, price } = req.body

    if (!title.trim() || !price || !description.trim() || !imageUrl.trim())
      throw new Error('All fields all required')

    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      userId: user,
    })

    await product.save()

    return res.redirect('/admin/products')
  } catch (error) {
    console.log(error.message)
    return res.redirect('/admin/products/add')
  }
}

const getEditProductForm = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) throw new Error('Product not found')

    return res.render('admin/edit-product', {
      product,
      docTitle: `Edit ${product.title}`,
      path: '/admin/products',
      isAuthenticated: req.session.user,
    })
  } catch (error) {
    console.log(error.message)
    return res.redirect('/admin/products')
  }
}

const editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { title, imageUrl, price, description } = req.body

    if (!title.trim() || !price || !description.trim() || !imageUrl.trim())
      throw new Error('All fields all required')

    await Product.findByIdAndUpdate(id, { title, imageUrl, price, description })

    return res.redirect(`/admin/products`)
  } catch (error) {
    const { id } = req.params

    console.log(error.message)
    return res.redirect(`/admin/edit/${id}`)
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body

    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) throw new Error('Product not found')

    return res.redirect('/admin/products')
  } catch (error) {
    console.log(error.message)
    return res.redirect('/admin/products')
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
