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
exports.addPost = async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Invalid fields, please try again.',
        errors: errors.array(),
      })
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
  } catch (error) {
    console.log(error)
  }
}
