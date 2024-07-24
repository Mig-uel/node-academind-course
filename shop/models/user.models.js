const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
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

UserSchema.methods.getCart = async function () {
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

module.exports = mongoose.model('User', UserSchema)
