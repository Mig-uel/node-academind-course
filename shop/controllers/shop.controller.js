const { Product } = require('../models/product.model')
const { Cart } = require('../models/cart.models')

const getHome = async (req, res) => {
  const products = await Product.fetchAllProducts()

  return res.render('shop/index', {
    products,
    docTitle: 'Home',
    path: '/',
  })
}

const getProducts = async (req, res) => {
  const products = await Product.fetchAllProducts()

  return res.render('shop/product-list', {
    products,
    docTitle: 'All Products',
    path: '/products',
  })
}

const getProduct = async (req, res) => {
  const { id } = req.params

  const product = await Product.findById(id)

  if (typeof product === 'string') return res.send(`<h1>${product}</h1>`)

  return res.render('shop/product-detail', {
    product,
    docTitle: product.title,
    path: '/products',
  })
}

const getCart = async (req, res) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = []

      products.forEach((p) => {
        cart.products.forEach((c) => {
          if (c.id === p.id) cartProducts.push({ ...p, qty: c.qty })
        })
      })

      return res.render('shop/cart', {
        cart: { products: [...cartProducts], totalPrice: cart.totalPrice },
        docTitle: 'Cart',
        path: '/cart',
      })
    })
  })
}

const addToCart = async (req, res) => {
  const { id } = req.body

  Product.findById(id, (product) => {
    if (!product) return res.send('<h1>Product not found</h1>')

    Cart.addToCart(id, product.price)
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
