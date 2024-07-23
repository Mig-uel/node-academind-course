const { Product } = require('../models/product.models')
const { User } = require('../models/user.models')

const getHome = async (req, res) => {
  try {
    const products = await Product.fetchAllProducts()

    if (!products) throw new Error()

    return res.render('shop/index', {
      products,
      docTitle: 'Home',
      path: '/',
    })
  } catch (error) {
    return res.send(`<h1>Error: ${error}</h1>`)
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAllProducts()

    if (!products) throw new Error()

    return res.render('shop/product-list', {
      products,
      docTitle: 'All Products',
      path: '/products',
    })
  } catch (error) {
    return res.send(`<h1>${error}</h1>`)
  }
}

const getProduct = async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.fetchProductById(id)

    return res.render('shop/product-detail', {
      product,
      docTitle: product.title,
      path: '/products',
    })
  } catch (error) {
    return res.send(`<h1>${error}</h1>`)
  }
}

const getCart = async (req, res) => {
  const { user } = req

  try {
    const userObj = new User(user.name, user.email, user._id, user.cart)

    const cart = await userObj.getCart()

    console.log(cart)

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
  const { id } = req.body
  const { user } = req

  try {
    const product = await Product.fetchProductById(id)

    const userObj = new User(user.username, user.email, user._id, user.cart)

    await userObj.addToCart(product)

    return res.redirect(302, '/cart')
  } catch (error) {
    console.log(error)
  }
}

const getOrders = async (req, res) => {
  return res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders',
  })
}

const addOrder = async (req, res) => {
  const { user } = req

  try {
    const userObj = new User(user.name, user.email, user._id, user.cart)

    await userObj.addOrder()

    return res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
}

const getCheckout = async (req, res) => {
  return res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  })
}

const removeFromCart = async (req, res) => {
  const { id } = req.body
  const { user } = req

  try {
    const userObj = new User(user.username, user.email, user._id, user.cart)
    await userObj.deleteItemFromCart(id)

    return res.redirect('/cart')
  } catch (error) {
    console.log(error)
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
