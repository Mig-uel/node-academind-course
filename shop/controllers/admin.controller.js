const { deleteFile } = require('../utils/clean-up-files.utils')
const { validationResult } = require('express-validator')
const Product = require('../models/product.models')

const ITEMS_PER_PAGE = 3

const adminGetProducts = async (req, res, next) => {
  try {
    const { user } = req
    const page = req.query.page || 1

    const products = await Product.find({ userId: user._id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)

    const count = await Product.find({
      userId: user._id,
    }).estimatedDocumentCount()

    return res.render('admin/admin-product-list', {
      products,
      docTitle: 'Admin All Products',
      path: '/admin/products',
      isAuthenticated: req.user,
      email: req.user.email,
      currentPage: Number(page),
      hasNextPage: ITEMS_PER_PAGE * Number(page) < count,
      hasPrevPage: Number(page) > 1,
      nextPage: Number(page) + 1,
      prevPage: Number(page) - 1,
      lastPage: Math.ceil(count / ITEMS_PER_PAGE),
    })
  } catch (error) {
    return next(error)
  }
}

const getAddProductForm = async (req, res) => {
  // validation
  const errors = validationResult(req)

  return res.status(200).render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/products/add',
    isAuthenticated: req.user,
    errors: errors.array(),
    prevInput: { title: '', imageUrl: '', description: '', price: '' },
    email: req?.user?.email,
  })
}

const addProduct = async (req, res, next) => {
  try {
    const { user } = req
    const { title, description, price } = req.body
    const image = req.file

    // validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).render('admin/add-product', {
        docTitle: 'Add Product',
        path: '/admin/products/add',
        isAuthenticated: req.user,
        errors: errors.array(),
        prevInput: { title, description, price },
      })
    }

    const imageUrl = image.path

    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      userId: user,
    })

    await product.save()

    return res.status(201).redirect('/admin/products')
  } catch (error) {
    return next(error)
  }
}

const getEditProductForm = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    // if no product is found
    if (!product) throw new Error('Product not found')

    // if user is not the creator of this product
    if (product.userId.toString() !== req.user._id.toString())
      throw new Error('Unauthorized to edit this product')

    // validation
    const errors = validationResult(req)

    return res.render('admin/edit-product', {
      product,
      docTitle: `Edit ${product.title}`,
      path: '/admin/products',
      isAuthenticated: req.user,
      errors: errors.array(),
      email: req.user.email,
    })
  } catch (error) {
    return next(error)
  }
}

const editProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, price, description } = req.body
    const image = req.file
    const product = await Product.findById(id)

    // if no product is found
    if (!product) throw new Error('Product not found')

    // if user is not the creator of this product
    if (product.userId.toString() !== req.user._id.toString())
      throw new Error('Unauthorized to edit this product')

    // validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        product,
        docTitle: `Edit ${product.title}`,
        path: '/admin/products',
        isAuthenticated: req.user,
        errors: errors.array(),
      })
    }

    let imageUrl = image?.path || product.imageUrl

    if (imageUrl === image?.path) {
      deleteFile(product.imageUrl)
    }

    await Product.findByIdAndUpdate(id, {
      title,
      imageUrl,
      price,
      description,
    })

    return res.status(204).redirect(`/admin/products`)
  } catch (error) {
    return next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id)

    if (!product) return res.status(404).json({ msg: 'Product not found' })

    deleteFile(product.imageUrl)

    await Product.deleteOne({
      _id: product._id,
      userId: req.user._id,
    })

    return res.status(200).json({ msg: 'Product deleted' })
  } catch (error) {
    return res.status(500).json(error)
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
