/**
 * @method GET
 * @route /feed/posts
 */
exports.getPosts = (req, res, next) => {
  return res.status(200).json({
    title: 'First Post',
    content: 'This is the first post!',
  })
}

/**
 * @method POST
 * @route /feed/posts
 */
exports.addPost = (req, res, next) => {
  const { title, content } = req.body
  const post = { title, content, id: new Date().toISOString() }

  // create post in database

  return res.status(201).json({ message: 'Post created', post })
}
