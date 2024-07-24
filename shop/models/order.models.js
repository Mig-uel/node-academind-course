const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, requierd: true },
        qty: { type: Number, required: true },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)
