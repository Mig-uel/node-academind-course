const Product = require('../models/product.models')
const User = require('../models/user.models')

const getHome = async (req, res) => {
  try {
    const products = await Product.find({})

    return res.render('shop/index', {
      products,
      docTitle: 'Home',
      path: '/',
    })
  } catch (error) {
    console.log(error.message)
    return res.redirect('/')
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})

    return res.render('shop/product-list', {
      products,
      docTitle: 'All Products',
      path: '/products',
    })
  } catch (error) {
    console.log(error.message)
    return res.redirect('/products')
  }
}

const getProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    return res.render('shop/product-detail', {
      product,
      docTitle: product.title,
      path: '/products',
    })
  } catch (error) {
    console.log(error)
    return res.redirect('/products')
  }
}

const getCart = async (req, res) => {
  try {
    const { user } = req

    const cart = await user.getCart()

    return res.render('shop/cart', {
      cart,
      docTitle: 'Cart',
      path: '/cart',
    })
  } catch (error) {
    return res.send(`<h1>${error}</h1>`)
  }
}

const addToCart = async (req, res) => {
  try {
    const { id } = req.body
    const { user } = req

    const product = await Product.findById(id)
    if (!product) throw new Error('Product not found')

    await user.addToCart(product)

    return res.redirect(302, '/cart')
  } catch (error) {
    console.log(error)
    return res.redirect('/products')
  }
}

const getOrders = async (req, res) => {
  try {
    const { user } = req

    const orders = await user.getOrders()

    return res.render('shop/orders', {
      orders,
      docTitle: 'Orders',
      path: '/orders',
    })
  } catch (error) {
    console.log(error)
  }
}

const addOrder = async (req, res) => {
  try {
    const { user } = req

    await user.createOrder()

    return res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
}

const getCheckout = async (req, res) => {
  const loggedIn = req.cookies.loggedIn

  return res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: loggedIn,
  })
}

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.body
    const { user } = req

    await user.removeFromCart(id)

    return res.redirect('/cart')
  } catch (error) {
    console.log(error)
    return res.redirect('/cart')
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
}
