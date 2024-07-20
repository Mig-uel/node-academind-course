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
    const cart = await user.getCart()

    if (!cart) throw new Error()

    const products = await cart.getProducts()

    return res.render('shop/cart', {
      cart: { products },
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

const getCheckout = async (req, res) => {
  return res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  })
}

const removeFromCart = (req, res) => {
  const { id } = req.body

  Product.findById(id, (product) => {
    if (!product) return res.send('<h1>Product not found</h1>')

    Cart.deleteFromCart(id, product.price)

    return res.redirect('/cart')
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
  removeFromCart,
}
