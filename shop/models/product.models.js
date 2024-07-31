const mongoose = require('mongoose')
const User = require('./user.models')

const ProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

ProductSchema.pre('deleteOne', async function () {
  const productId = this._conditions._id

  const users = await User.find({ 'cart.items.productId': productId })

  if (!users) return

  users.forEach(async (user) => {
    user.cart.items = user.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    )
    await user.save()
  })
})

module.exports = mongoose.model('Product', ProductSchema)
