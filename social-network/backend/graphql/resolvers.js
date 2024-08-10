const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const { unlinkFile } = require('../utils/unlinkFile.utils')

// models
const User = require('../models/user.model')
const Post = require('../models/post.model')

// the root provides a resolver function for each API endpoint
exports.root = {
  // signup
  async signup(args, { req }) {
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
  async addPost(args, { req }) {
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

    user.posts.push(createdPost)
    await user.save()

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    }
  },

  async posts(args, { req }) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    let { page } = args
    if (!page) page = 1

    const perPage = 2
    const totalPosts = await Post.find({}).estimatedDocumentCount()
    const posts = await Post.find({})
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('creator')

    return {
      posts: posts.map((post) => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        }
      }),
      totalPosts,
    }
  },

  async post(args, { req }) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    const { id } = args

    const post = await Post.findById(id).populate('creator')
    if (!post) {
      const error = new Error('Post not found!')
      error.code = 404
      throw error
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }
  },

  async updatePost(args, { req }) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    const {
      id,
      post: { title, content, imageUrl },
    } = args

    const post = await Post.findById(id).populate('creator')
    if (!post) {
      const error = new Error('No post found!')
      error.code = 404
      throw error
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Unauthorized!')
      error.code = 403
      throw error
    }

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

    post.title = title
    post.content = content
    if (imageUrl !== 'undefined') {
      post.imageUrl = imageUrl
    }

    const updatedPost = await post.save()

    return {
      ...updatedPost._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }
  },

  // delete post
  async deletePost(args, { req }) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    const { id } = args
    console.log(id)

    // validate
    const errors = []
    if (validator.isEmpty(id))
      errors.push({ type: 'id', message: 'Invalid ID.' })

    const post = await Post.findById(id)

    if (!post) {
      const error = new Error('Post not found.')
      error.code = 404
      throw error
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error('Unauthorized!')
      error.code = 403
      throw error
    }

    // remove image from server
    unlinkFile(post.imageUrl)

    await post.deleteOne()

    // delete post from user
    const user = await User.findById(req.userId)

    if (!user) {
      const error = new Error('User not found.')
      error.status = 404
      throw error
    }

    user.posts.pull(id)
    await user.save()

    return true
  },

  // get status
  async status(args, { req }) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('User not found.')
      error.code = 404
      throw error
    }

    return {
      status: user.status,
    }
  },

  // update status
  async updateStatus(args, { req }) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }

    const { status } = args

    const errors = []
    if (validator.isEmpty(status))
      errors.push({ type: 'status', message: 'Status cannot be empty.' })
    if (validator.isURL(status))
      errors.push({ type: 'status', message: 'Status cannot be a URL.' })

    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('User not found.')
      error.code = 404
      throw error
    }

    user.status = status
    await user.save()

    return {
      status,
    }
  },
}
