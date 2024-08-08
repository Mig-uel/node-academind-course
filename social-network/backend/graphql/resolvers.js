const bcrypt = require('bcryptjs')
const User = require('../models/user.model')

// the root provides a resolver function for each API endpoint
exports.root = {
  async signup(args, req) {
    const { email, password, name } = args.userInput

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const error = new Error('Email is already in use!')
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({ email, password: hashedPassword, name })
    const createdUser = await user.save()

    return { ...user._doc, _id: createdUser._id.toString() }
  },
}
