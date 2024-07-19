const Product = require('../models/product.models')
const { Cart } = require('../models/cart.models')

const getHome = async (req, res) => {
  try {
    const products = await Product.findAll()

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
    const products = await Product.findAll()

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
    const product = await Product.findByPk(id)

    if (!product) throw new Error()

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
