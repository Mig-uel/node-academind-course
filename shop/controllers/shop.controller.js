const { Product } = require('../models/product.model')

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

const getCart = async (req, res) => {
  return res.render('shop/cart', {
    docTitle: 'Cart',
    path: '/cart',
  })
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

module.exports = { getHome, getProducts, getCart, getOrders, getCheckout }
