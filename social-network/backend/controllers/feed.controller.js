const { validationResult } = require('express-validator')

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
exports.addPost = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: 'Invalid fields, please try again.',
        errors: errors.array(),
      })
  }

  const { title, content } = req.body

  if (!title || !content)
    return res.status(500).json({ error: 'Missing fields' })

  const post = {
    title,
    content,
    _id: Date.now(),
    content,
    creator: { name: 'Miguel' },
    createdAt: new Date(),
  }

  // create post in database

  return res.status(201).json({ message: 'Post created', post })
}
