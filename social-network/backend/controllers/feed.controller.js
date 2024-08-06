const { asyncHandler } = require('../utils/asyncHandler.utils')
const { validationResult } = require('express-validator')
const { throwError } = require('../utils/throwError.utils')
const Post = require('../models/post.model')

/**
 * @method GET
 * @route /feed/posts
 * @access Private
 */
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({})

  if (!posts) throwError('Posts not found.', 404)

  return res.status(200).json({ message: 'Posts fetched.', posts })
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
    creator: { name: 'Miguel' },
    imageUrl,
  })
  await post.save()

  if (!post) throw new Error()

  return res.status(201).json({ message: 'Post created', post })
})
