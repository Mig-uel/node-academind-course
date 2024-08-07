const fs = require('fs')
const path = require('path')
const { asyncHandler } = require('../utils/asyncHandler.utils')
const { validationResult } = require('express-validator')
const { throwError } = require('../utils/throwError.utils')

// models
const Post = require('../models/post.model')
const User = require('../models/user.model')

/**
 * @method GET
 * @route /feed/posts
 * @access Private
 */
exports.getPosts = asyncHandler(async (req, res, next) => {
  const currentPage = req.query.page || 1
  const perPage = 2

  const totalItems = await Post.find({}).estimatedDocumentCount()
  const posts = await Post.find({})
    .skip((currentPage - 1) * perPage)
    .limit(perPage)

  if (!posts) throwError('Posts not found.', 404)

  return res.status(200).json({ message: 'Posts fetched.', posts, totalItems })
})

/**
 * @method GET
 * @route /feed/posts/:id
 * @access Private
 */
exports.getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const post = await Post.findById(id)

  if (!post) throwError('Post not found.', 404)

  return res.status(200).json({ message: 'Post fetched.', post })
})

/**
 * @method POST
 * @route /feed/posts
 * @access Private
 */
exports.addPost = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty())
    throwError('Invalid or missing fields, please try again.', 422)

  if (!req.file) throwError('No image provided.', 422)

  const { title, content } = req.body

  const imageUrl = req.file.path.replace('\\', '/')

  // create post in database
  const post = new Post({
    title,
    content,
    creator: req.userId,
    imageUrl,
  })
  await post.save()

  const user = await User.findById(req.userId)
  if (!user) throwError('User not found.', 404)

  user.posts.push(post)
  await user.save()

  return res.status(201).json({
    message: 'Post created',
    post,
    creator: { _id: user._id, name: user.name },
  })
})

/**
 * @method PATCH
 * @route /feed/posts/:id
 * @access Private
 */
exports.updatePost = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty())
    throwError('Invalid or missing fields, please try again.', 422)

  const { id } = req.params
  const { title, content } = req.body
  const imageUrl = req.body.image || req.file.path.replace('\\', '/')

  const post = await Post.findById(id)

  if (!post) throwError('Post not found.', 404)
  if (post.creator.toString() !== req.userId) throwError('Unauthorized.', 403)

  if (imageUrl !== post.imageUrl) {
    removeImage(post.imageUrl)
    post.imageUrl = imageUrl
  }

  post.title = title
  post.content = content
  await post.save()

  return res.status(200).json({ message: 'Post updated.', post })
})

/**
 * @method DELETE
 * @route /feed/posts/:id
 * @access Private
 */
exports.deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const post = await Post.findById(id)

  if (!post) throwError('Post not found.', 404)
  if (post.creator.toString() !== req.userId) throwError('Unauthorized.', 403)

  removeImage(post.imageUrl)
  await post.deleteOne()

  // remove post association from user
  const user = await User.findById(req.userId)
  if (!user) throwError('User not found.', 404)

  user.posts.pull(id)
  await user.save()

  return res.status(200).json({ message: 'Post deleted.' })
})

/**
 * @description Removes old image when updating image of post
 * @param {*} filePath
 */
const removeImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, (err) => console.log(err))
}
