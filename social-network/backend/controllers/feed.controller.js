const { asyncHandler } = require('../utils/asyncHandler.utils')
const { validationResult } = require('express-validator')
const Post = require('../models/post.model')

/**
 * @method GET
 * @route /feed/posts
 */
exports.getPosts = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/duckies.jpeg',
        creator: {
          name: 'Miguel',
        },
        createdAt: new Date(),
        _id: Date.now(),
      },
    ],
  })
}

/**
 * @method POST
 * @route /feed/posts
 */
exports.addPost = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error('Invalid or missing fields, please try again.')
    error.statusCode = 422

    throw error
  }

  const { title, content } = req.body

  // create post in database
  const post = new Post({
    title,
    content,
    creator: { name: 'Miguel' },
    imageUrl: 'images/duckies.jpg',
  })
  await post.save()

  if (!post) throw new Error()

  return res.status(201).json({ message: 'Post created', post })
})
