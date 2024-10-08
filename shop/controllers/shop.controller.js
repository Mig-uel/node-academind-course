const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const Product = require('../models/product.models')
const Order = require('../models/order.models')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const ITEMS_PER_PAGE = 5

const getHome = async (req, res, next) => {
  try {
    const products = await Product.find({}).limit(3)

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
    const page = req.query.page || 1

    const count = await Product.find({}).estimatedDocumentCount()

    const products = await Product.find({})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)

    // if no products are found because of mongo error
    if (!products) throw new Error('Cannot fetch products')

    return res.render('shop/product-list', {
      products,
      docTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.user,
      email: req?.user?.email,
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

const getCheckout = async (req, res, next) => {
  try {
    const { user } = req

    // if (!user) return res.redirect('/')

    const cart = await user.getCart()
    const cartTotal = cart.reduce((acc, curr) => curr.price * curr.qty + acc, 0)

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map((p) => ({
        price_data: {
          currency: 'usd',
          unit_amount: p.price * 100,
          product_data: {
            name: p.title,
            description: p.description,
          },
        },
        quantity: p.qty,
      })),
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
    })

    return res.render('shop/checkout', {
      cart,
      docTitle: 'Checkout',
      path: '/checkout',
      isAuthenticated: req.user,
      email: req?.user?.email,
      cartTotal,
      stripeUrl: stripeSession.url,
    })
  } catch (error) {
    return next(error)
  }
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

    const invoicePdf = new PDFDocument().font('Helvetica')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)

    invoicePdf.pipe(fs.createWriteStream(invoicePath))

    invoicePdf.pipe(res)

    invoicePdf
      .font('Helvetica-Bold')
      .fontSize(16)
      .text(`Invoice - #${orderId}`, { underline: true })

    let totalPrice = 0

    order.products.forEach((product, index) => {
      let totalItemPrice = product.price * product.qty
      totalPrice += totalItemPrice
      invoicePdf.moveDown()
      invoicePdf
        .font('Helvetica-Bold')
        .fontSize(14)
        .text(`Item ${index + 1}`, { underline: true })
      invoicePdf.font('Helvetica').fontSize(12).text('Item Name:')
      invoicePdf.text(product.title, { lineGap: 5 })
      invoicePdf.text('Description:')
      invoicePdf.text(product.description, { lineGap: 5 })
      invoicePdf.text(`Quantity: ${product.qty}`, { lineGap: 5 })
      invoicePdf.text('Price:')
      invoicePdf.text(`$${product.price.toLocaleString()}`, { lineGap: 5 })
      invoicePdf.text('Total Item Price')
      invoicePdf.text(`$${totalItemPrice.toLocaleString()}`)
    })

    invoicePdf.moveDown()
    invoicePdf
      .font('Helvetica-Bold')
      .fontSize(16)
      .text(`Total: $${totalPrice.toLocaleString()}`)
    invoicePdf.end()
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

const getSuccess = async (req, res) => {
  return res.render('checkout/success', {
    url: '/orders/add',
    docTitle: 'Success',
    path: '',
  })
}

const getCancel = async (req, res) => {
  return res.render('checkout/cancel', {
    url: '/cart',
    docTitle: 'Cancelled',
    path: '',
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
  addOrder,
  removeFromCart,
  getInvoice,

  getSuccess,
  getCancel,
}
