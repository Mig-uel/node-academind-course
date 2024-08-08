const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

// the root provides a resolver function for each API endpoint
exports.root = {
  // signup
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

  // login
  async login(args) {
    const { email, password } = args

    const errors = []
    if (!validator.isEmail(email))
      errors.push({ type: 'email', message: 'Invalid email.' })
    if (errors.length) {
      const error = new Error('Invalid input.')
      error.data = errors
      error.code = 422
      throw error
    }

    const user = await User.findOne({ email })

    if (!user) {
      const error = new Error('Incorrect email/password.')
      error.code = 401
      throw error
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      const error = new Error('Incorrect email/password.')
      error.code = 401
      throw error
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )

    return { token, userId: user._id.toString() }
  },
}
