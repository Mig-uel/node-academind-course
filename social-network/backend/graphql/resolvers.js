const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

// models
const User = require('../models/user.model')
const Post = require('../models/post.model')

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

    // validation
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

  // add post
  async addPost(args, req) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    const { title, content, imageUrl } = args.post

    // validation
    const errors = []
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ type: 'title', message: 'Invalid title.' })
    }
    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ type: 'content', message: 'Invalid content.' })
    }
    if (errors.length) {
      const error = new Error('Invalid input.')
      error.data = errors
      error.code = 422
      throw error
    }

    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    const post = new Post({ title, content, imageUrl, creator: user })
    const createdPost = await post.save()

    user.push(createdPost)
    await user.save()

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    }
  },
}
