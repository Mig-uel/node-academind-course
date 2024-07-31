const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Order = require('./order.models')

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
    cart: {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          qty: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
)

UserSchema.methods.addToCart = async function (product) {
  const existingProduct = await this.cart.items.find(
    (item) => item.productId.toString() === product._id.toString()
  )

  if (existingProduct) {
    this.cart.items = this.cart.items.map((item) => {
      if (item.productId.toString() === existingProduct.productId.toString())
        return { ...item, qty: item.qty + 1 }
      else return item
    })
  } else {
    this.cart.items = [...this.cart.items, { productId: product._id, qty: 1 }]
  }

  await this.save()
}

// UserSchema.methods.checkCart = async function () {
//   if (!this.cart.items.length) return

//   // check for products that have been deleted from product list, and return filtered cart
//   this.cart.items = this.cart.items.filter((item) => item.productId !== null)

//   await this.save()
// }

UserSchema.methods.getCart = async function () {
  if (!this.cart.items.length) return this.cart

  const populatedCart = await this.cart.populate('items.productId')

  const cart = populatedCart.items.map((i) => {
    return { ...i.productId._doc, qty: i.qty }
  })

  return cart
}

UserSchema.methods.removeFromCart = async function (id) {
  this.cart.items = this.cart.items.filter(
    (i) => i.productId.toString() !== id.toString()
  )

  await this.save()

  return
}

UserSchema.methods.createOrder = async function () {
  const products = await this.cart.populate(
    'items.productId',
    'title price description imageUrl'
  )
  const populatedProducts = products.items.map((i) => ({
    ...i.productId._doc,
    qty: i.qty,
  }))

  const orderObj = { products: populatedProducts, user: this._id }

  const order = new Order(orderObj)

  await order.save()

  this.cart = { items: [] }
  await this.save()

  return
}

UserSchema.methods.getOrders = async function () {
  const orders = await Order.find({ user: this._id }).lean()

  return orders
}

module.exports = mongoose.model('User', UserSchema)
