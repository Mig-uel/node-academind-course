const { Router } = require('express')

// middleware
const { isAuth } = require('../middleware/auth.middleware')
const { body } = require('express-validator')

// feed controllers
const {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
} = require('../controllers/feed.controller')

// init router obj
const router = Router()

// GET /feed/posts
router.get('/posts', isAuth, getPosts)

// POST /feed/posts
router.post(
  '/posts',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  addPost
)

// GET /feed/post/:id
router.get('/posts/:id', getPost)

// PATCH /feed/posts/:id
router.patch(
  '/posts/:id',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  updatePost
)

// DELETE /feed/posts/:id
router.delete('/posts/:id', deletePost)

module.exports = router
