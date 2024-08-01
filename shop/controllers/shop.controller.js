const fs = require('fs')
const path = require('path')
const Product = require('../models/product.models')
const Order = require('../models/order.models')

const getHome = async (req, res, next) => {
  try {
    const products = await Product.find({})

    // if no products are found because of mongo error
    if (!products) throw new Error('Cannot fetch products')

    return res.render('shop/index', {
      products,
      docTitle: 'Home',
      path: '/',
      isAuthenticated: req.user,
      email: req?.user?.email,
    })
  } catch (error) {
    return next(error)
  }
}

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})

    // if no products are found because of mongo error
    if (!products) throw new Error('Cannot fetch products')

    return res.render('shop/product-list', {
      products,
      docTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.user,
      email: req?.user?.email,
    })
  } catch (error) {
    return next(error)
  }
}

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    // if no product is found
    if (!product) throw new Error('Product not found')

    return res.render('shop/product-detail', {
      product,
      docTitle: product.title,
      path: '/products',
      isAuthenticated: req.user,
      email: req?.session?.user?.email,
    })
  } catch (error) {
    return next(error)
  }
}

const getCart = async (req, res, next) => {
  try {
    const { user } = req

    const cart = await user.getCart()

    return res.render('shop/cart', {
      cart,
      docTitle: 'Cart',
      path: '/cart',
      isAuthenticated: req.user,
      email: req?.session?.user?.email,
    })
  } catch (error) {
    return next(error)
  }
}

const addToCart = async (req, res, next) => {
  try {
    const { id } = req.body
    const { user } = req

    const product = await Product.findById(id)

    // if no product is found
    if (!product) throw new Error('Product not found')

    await user.addToCart(product)

    return res.redirect(302, '/cart')
  } catch (error) {
    return next(error)
  }
}

const getOrders = async (req, res, next) => {
  try {
    const { user } = req

    const orders = await user.getOrders()

    return res.render('shop/orders', {
      orders,
      docTitle: 'Orders',
      path: '/orders',
      isAuthenticated: req.user,
      email: req.user.email,
    })
  } catch (error) {
    return next(error)
  }
}

const addOrder = async (req, res, next) => {
  try {
    const { user } = req

    await user.createOrder()

    return res.redirect('/orders')
  } catch (error) {
    return next(error)
  }
}

const getCheckout = async (req, res) => {
  return res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: req.user,
  })
}

const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.body
    const { user } = req

    await user.removeFromCart(id)

    return res.redirect('/cart')
  } catch (error) {
    return res.redirect('/cart')
  }
}

const getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)

    if (!order) throw new Error('Order not found')

    if (order.user.toString() !== req.user._id.toString())
      throw new Error('Unauthorized')

    const invoiceName = `invoice-${orderId}.pdf`
    const invoicePath = path.join('data', 'invoices', invoiceName)

    const file = fs.createReadStream(invoicePath)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)

    // stream data
    file.pipe(res)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getHome,
  getProducts,
  getProduct,
  getCart,
  addToCart,
  getOrders,
  addOrder,
  getCheckout,
  removeFromCart,
  getInvoice,
}
