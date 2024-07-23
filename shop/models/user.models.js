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

module.exports = mongoose.model('User', UserSchema)
