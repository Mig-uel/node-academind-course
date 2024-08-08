const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require('../models/user.model')

// the root provides a resolver function for each API endpoint
exports.root = {
  async signup(args, req) {
    const { email, password, name } = args.userInput

    // validation
    const errors = []
    if (validator.isEmpty(name))
      errors.push({ type: 'name', message: 'Name is empty.' })
    if (!validator.isEmail(email))
      errors.push({ type: 'email', message: 'Email is invalid.' })
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    )
      errors.push({ type: 'password', message: 'Password too short.' })
    if (errors.length) {
      const error = new Error('Invalid input.')
      error.data = errors
      error.code = 422
      throw error
    }

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
