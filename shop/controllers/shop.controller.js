const { Product } = require('../models/product.model')
const { Cart } = require('../models/cart.models')

const getHome = async (req, res) => {
  Product.fetchAll((products) => {
    return res.render('shop/index', {
      products,
      docTitle: 'Home',
      path: '/',
    })
  })
}

const getProducts = async (req, res) => {
  Product.fetchAll((products) => {
    return res.render('shop/product-list', {
      products,
      docTitle: 'All Products',
      path: '/products',
    })
  })
}

const getProduct = async (req, res) => {
  const { id } = req.params

  Product.findById(id, (product) => {
    if (!product) return res.send('<h1>Product not found!</h1>')

    return res.render('shop/product-detail', {
      product,
      docTitle: product.title,
      path: '/products',
    })
  })
}

const getCart = async (req, res) => {
  return res.render('shop/cart', {
    docTitle: 'Cart',
    path: '/cart',
  })
}

const addToCart = async (req, res) => {
  const { id } = req.body

  Product.findById(id, (product) => {
    if (product) {
      Cart.addProduct(id, product.price)
    }
  })

  return res.redirect(302, '/cart')
}

const getOrders = async (req, res) => {
  return res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders',
  })
}

const getCheckout = async (req, res) => {
  return res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  })
}

module.exports = {
  getHome,
  getProducts,
  getProduct,
  getCart,
  addToCart,
  getOrders,
  getCheckout,
}
